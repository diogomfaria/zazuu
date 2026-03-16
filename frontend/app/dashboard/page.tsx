'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Box, Container, Heading, Button, Table,
    Input, HStack, useDisclosure, IconButton,
    Skeleton, VStack, Text, Stack
} from '@chakra-ui/react';
import { Plus, Search, Trash2, Edit3, LogOut, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { ProductModal } from '@/components/productModal';
import { ConfirmationModal } from '@/components/confirmationModal';
import { FilterDrawer } from '@/components/filterDrawer';
import { EmptyState } from '@/components/emptyState';
import { TableSkeleton } from '@/components/tableSkeleton';
import { CardSkeleton } from '@/components/cardSkeleton';
import { ProductCard } from '@/components/productCard';
import { toaster } from '@/components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';

const MotionButton = motion(Button);
const MotionTableRow = motion(Table.Row);
const MotionIconButton = motion(IconButton) as any;
const MotionBox = motion(Box);

interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number;
}

export default function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [priceFilters, setPriceFilters] = useState({ minPrice: '', maxPrice: '' });
    const filterDrawer = useDisclosure();

    // Selection state for deletion
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteModal = useDisclosure();

    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const productModal = useDisclosure();
    const router = useRouter();

    const fetchProducts = useCallback(async (search = '', minP = '', maxP = '') => {
        setLoading(true);
        try {
            // Consolidating search for name and description
            const params: Record<string, string> = {};
            if (search) {
                params.name = search; // Simplification: let backend or frontend filter
            }

            const { data } = await api.get('/products', { params });

            // Client-side filtering enhancement
            let filtered = data.filter((p: Product) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
            );

            // Price filtering
            if (minP) {
                const min = parseFloat(minP.replace(',', '.'));
                filtered = filtered.filter((p: Product) => Number(p.price) >= min);
            }
            if (maxP) {
                const max = parseFloat(maxP.replace(',', '.'));
                filtered = filtered.filter((p: Product) => Number(p.price) <= max);
            }

            setProducts(filtered);
        } catch (error) {
            toaster.create({ title: 'Erro ao carregar produtos', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(searchTerm, priceFilters.minPrice, priceFilters.maxPrice);
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, priceFilters, fetchProducts]);

    useEffect(() => {
        const token = localStorage.getItem('@Zazuu:token');
        if (!token) {
            router.push('/auth');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('@Zazuu:token');
        router.push('/auth');
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/products/${productToDelete.id}`);
            setProducts((prev) => prev.filter(p => p.id !== productToDelete.id));
            toaster.create({ title: 'Produto removido com sucesso', type: 'success' });
            deleteModal.onClose();
        } catch (error: any) {
            toaster.create({
                title: 'Erro na operação',
                description: error.response?.data?.message || 'Tente novamente',
                type: 'error'
            });
        } finally {
            setIsDeleting(false);
            setProductToDelete(null);
        }
    };

    const handleEditClick = (product: Product) => {
        setProductToEdit(product);
        productModal.onOpen();
    };

    const handleNewClick = () => {
        setProductToEdit(null);
        productModal.onOpen();
    };

    const handleModalClose = () => {
        setProductToEdit(null);
        productModal.onClose();
    };

    const triggerDelete = (product: Product) => {
        setProductToDelete(product);
        deleteModal.onOpen();
    };

    return (
        <Box minH="100vh" bg="brand.bg" py={{ base: 6, md: 12 }} className="font-outfit">
            <Container maxW="1200px" mx="auto" px={{ base: 4, md: 6 }}>
                {/* Header Section */}
                <HStack
                    justify="space-between"
                    mb={{ base: 8, md: 12 }}
                    align={{ base: 'start', md: 'end' }}
                    flexDir={{ base: 'column', md: 'row' }}
                    gap={{ base: 6, md: 0 }}
                >
                    <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <VStack align="start" gap={1}>
                            <Logo width={120} height={46} />
                            <Heading size="3xl" color="zazuu.purple" fontWeight="bold" mt={4}>
                                Meus Produtos
                            </Heading>
                            <Text color="gray.500" fontSize="lg">Gerencie seu inventário com precisão</Text>
                        </VStack>
                    </MotionBox>

                    <MotionButton
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ color: 'red.500', scale: 1.05 }}
                        variant="ghost"
                        onClick={handleLogout}
                        color="zazuu.purple"
                        _hover={{ bg: 'white' }}
                        ml="auto"
                    >
                        <LogOut size={18} style={{ marginRight: '8px' }} /> Sair
                    </MotionButton>
                </HStack>

                {/* Dashboard Main Card */}
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    bg="white"
                    p={{ base: 6, md: 8 }}
                    borderRadius={{ base: '2xl', md: '3xl' }}
                    boxShadow="subtle"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    {/* Consolidated Search & Actions Bar */}
                    <Stack mb={8} gap={4} direction={{ base: 'column', md: 'row' }} align="stretch">
                        <Box flex={1} position="relative">
                            <Input
                                placeholder="Pesquisar por nome, preço ou descrição..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                pl={12}
                                h="56px"
                                rounded="2xl"
                                bg="gray.50"
                                border="1px solid"
                                borderColor="transparent"
                                _placeholder={{ color: "gray.400", transition: "color 0.2s" }}
                                _focus={{
                                    bg: "white",
                                    borderColor: "zazuu.purple",
                                    boxShadow: "0 0 0 4px rgba(50, 18, 77, 0.08)",
                                    outline: "none",
                                    _placeholder: { color: "gray.300" }
                                }}
                                transition="all 0.3s"
                            />
                            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)" color="zazuu.purple">
                                <Search size={22} />
                            </Box>
                        </Box>

                        <Stack direction={{ base: 'column', md: 'row' }} gap={3} w={{ base: 'full', md: 'auto' }} align="stretch">
                            <Button
                                variant="outline"
                                h="56px"
                                px={6}
                                rounded="2xl"
                                borderColor="gray.200"
                                color="gray.600"
                                onClick={filterDrawer.onOpen}
                                _hover={{ bg: 'gray.50' }}
                                w={{ base: 'full', md: 'auto' }}
                                minW={{ md: "120px" }}
                            >
                                <Filter size={18} style={{ marginRight: '8px' }} /> Filtros
                            </Button>

                            <MotionButton
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
                                whileHover={{ scale: 1.02, translateY: -2, boxShadow: "0 10px 20px rgba(193, 226, 69, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                bg="zazuu.lime"
                                color="#292929"
                                rounded="2xl"
                                px={{ base: 6, md: 8 }}
                                h="56px"
                                fontWeight="bold"
                                boxShadow="subtle"
                                onClick={handleNewClick}
                                _hover={{ bg: '#c1e245' }}
                                w={{ base: 'full', md: 'auto' }}
                            >
                                <Plus size={20} style={{ marginRight: '8px' }} /> Novo Produto
                            </MotionButton>
                        </Stack>
                    </Stack>

                    {/* Smart Transmutation Section */}
                    {loading && products.length === 0 ? (
                        <Box>
                            <Box display={{ base: 'none', md: 'block' }}>
                                <Box overflowX="auto" rounded="2xl" border="1px solid" borderColor="gray.100">
                                    <Table.Root variant="line">
                                        <Table.Header>
                                            <Table.Row bg="gray.50/50">
                                                <Table.ColumnHeader py={6} color="zazuu.purple" fontWeight="bold">PRODUTO</Table.ColumnHeader>
                                                <Table.ColumnHeader py={6} color="zazuu.purple" fontWeight="bold">DESCRIÇÃO</Table.ColumnHeader>
                                                <Table.ColumnHeader py={6} color="zazuu.purple" fontWeight="bold" textAlign="end">PREÇO</Table.ColumnHeader>
                                                <Table.ColumnHeader py={6} color="zazuu.purple" fontWeight="bold" textAlign="end">AÇÕES</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            <TableSkeleton />
                                        </Table.Body>
                                    </Table.Root>
                                </Box>
                            </Box>
                            <Box display={{ base: 'block', md: 'none' }}>
                                <CardSkeleton />
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            {products.length > 0 ? (
                                <>
                                    {/* Desktop Table View */}
                                    <Box display={{ base: 'none', md: 'block' }} overflowX="auto" rounded="2xl" border="1px solid" borderColor="gray.100">
                                        <Table.Root variant="line">
                                            <Table.Header>
                                                <Table.Row bg="gray.50/50">
                                                    <Table.ColumnHeader py={6} color="zazuu.purple" fontWeight="bold">PRODUTO</Table.ColumnHeader>
                                                    <Table.ColumnHeader py={6} color="zazuu.purple" fontWeight="bold">DESCRIÇÃO</Table.ColumnHeader>
                                                    <Table.ColumnHeader py={6} color="zazuu.purple" fontWeight="bold" textAlign="end">PREÇO</Table.ColumnHeader>
                                                    <Table.ColumnHeader py={6} color="zazuu.purple" fontWeight="bold" textAlign="end">AÇÕES</Table.ColumnHeader>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                <AnimatePresence mode="popLayout">
                                                    {products.map((product, index) => (
                                                        <MotionTableRow
                                                            key={product.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                                transition: {
                                                                    delay: index * 0.05,
                                                                    duration: 0.5,
                                                                    ease: [0.25, 1, 0.5, 1]
                                                                }
                                                            }}
                                                            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } as any }}
                                                            role="group"
                                                            whileHover={{
                                                                backgroundColor: 'rgba(50, 18, 77, 0.02)',
                                                                y: -1,
                                                            }}
                                                            _hover={{
                                                                boxShadow: 'sm'
                                                            }}
                                                            transition={{
                                                                duration: 0.4,
                                                                ease: [0.25, 1, 0.5, 1]
                                                            } as any}
                                                        >
                                                            <Table.Cell py={6} fontWeight="semibold" color="zazuu.purple">
                                                                {product.name}
                                                            </Table.Cell>
                                                            <Table.Cell py={6} color="gray.500" fontSize="sm" maxW="400px">
                                                                {product.description}
                                                            </Table.Cell>
                                                            <Table.Cell py={6} textAlign="end" fontWeight="bold">
                                                                R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </Table.Cell>
                                                            <Table.Cell py={6} textAlign="end">
                                                                <HStack gap={3} justify="end">
                                                                    <MotionIconButton
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        aria-label="Editar" size="sm" variant="outline"
                                                                        rounded="full"
                                                                        onClick={() => handleEditClick(product)}
                                                                        borderColor="gray.100"
                                                                        color="zazuu.purple"
                                                                        opacity="0.6"
                                                                        _groupHover={{ opacity: 1 }}
                                                                        _hover={{
                                                                            backgroundColor: 'white',
                                                                            borderColor: 'gray.200',
                                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                                                                        }}
                                                                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] } as any}
                                                                    >
                                                                        <Edit3 size={16} />
                                                                    </MotionIconButton>
                                                                    <MotionIconButton
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        aria-label="Deletar" size="sm" variant="ghost"
                                                                        rounded="full"
                                                                        color="gray.400"
                                                                        opacity="0.6"
                                                                        _groupHover={{ opacity: 1 }}
                                                                        onClick={() => triggerDelete(product)}
                                                                        _hover={{
                                                                            backgroundColor: 'red.50',
                                                                            color: 'red.500',
                                                                            boxShadow: "0 4px 12px rgba(220, 38, 38, 0.1)"
                                                                        }}
                                                                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] } as any}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </MotionIconButton>
                                                                </HStack>
                                                            </Table.Cell>
                                                        </MotionTableRow>
                                                    ))}
                                                </AnimatePresence>
                                            </Table.Body>
                                        </Table.Root>
                                    </Box>

                                    {/* Mobile Cards View */}
                                    <Box display={{ base: 'block', md: 'none' }}>
                                        <VStack gap={4}>
                                            <AnimatePresence mode="popLayout">
                                                {products.map((product, index) => (
                                                    <ProductCard
                                                        key={`card-${product.id}`}
                                                        product={product}
                                                        onEdit={handleEditClick}
                                                        onDelete={triggerDelete}
                                                        index={index}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                        </VStack>
                                    </Box>
                                </>
                            ) : (
                                <EmptyState onAction={handleNewClick} />
                            )}
                        </Box>
                    )}
                </MotionBox>
            </Container>

            {/* Modals */}
            <ProductModal
                isOpen={productModal.open}
                onClose={handleModalClose}
                onSuccess={() => fetchProducts(searchTerm)}
                productToEdit={productToEdit}
            />

            <ConfirmationModal
                isOpen={deleteModal.open}
                onClose={deleteModal.onClose}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                description={`Tem certeza que deseja excluir "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
                loading={isDeleting}
            />

            <FilterDrawer
                isOpen={filterDrawer.open}
                onClose={filterDrawer.onClose}
                filters={priceFilters}
                onApply={(filters) => setPriceFilters(filters)}
                onReset={() => setPriceFilters({ minPrice: '', maxPrice: '' })}
            />
        </Box>
    );
}
