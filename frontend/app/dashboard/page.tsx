'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Box, Container, Heading, Button, Table,
    Input, HStack, useDisclosure, IconButton, createToaster,
    Skeleton, VStack, Text
} from '@chakra-ui/react';
import { Plus, Search, Trash2, Edit3, LogOut, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { ProductModal } from '@/components/productModal';
import { ConfirmationModal } from '@/components/confirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';

const toaster = createToaster({ placement: 'bottom-end' });

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

    // Selection state for deletion
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteModal = useDisclosure();

    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const productModal = useDisclosure();
    const router = useRouter();

    const fetchProducts = useCallback(async (search = '') => {
        setLoading(true);
        try {
            // Consolidating search for name and description
            const params: Record<string, string> = {};
            if (search) {
                params.name = search; // Simplification: let backend or frontend filter
            }

            const { data } = await api.get('/products', { params });

            // Client-side filtering enhancement if needed
            const filtered = data.filter((p: Product) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
            );

            setProducts(filtered);
        } catch (error) {
            toaster.create({ title: 'Erro ao carregar produtos', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(searchTerm);
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchProducts]);

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
            toaster.create({ title: 'Produto removido com segurança', type: 'success' });
            deleteModal.onClose();
        } catch (error: any) {
            toaster.create({
                title: 'Erro ao remover',
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
        <Box minH="100vh" bg="brand.bg" py={12} className="font-outfit">
            <Container maxW="container.xl">
                {/* Header Section */}
                <HStack justify="space-between" mb={12} align="end">
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

                    <HStack gap={4}>
                        <MotionButton
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
                            whileHover={{ scale: 1.02, translateY: -2, boxShadow: "0 10px 20px rgba(193, 226, 69, 0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            bg="zazuu.lime"
                            color="#292929"
                            rounded="full"
                            px={8}
                            h="56px"
                            fontWeight="bold"
                            boxShadow="subtle"
                            onClick={handleNewClick}
                            _hover={{ bg: '#c1e245' }}
                        >
                            <Plus size={20} style={{ marginRight: '8px' }} /> Novo Produto
                        </MotionButton>
                        <MotionButton
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ color: 'red.500', scale: 1.05 }}
                            variant="ghost"
                            onClick={handleLogout}
                            color="zazuu.purple"
                            _hover={{ bg: 'white' }}
                        >
                            <LogOut size={18} style={{ marginRight: '8px' }} /> Sair
                        </MotionButton>
                    </HStack>
                </HStack>

                {/* Dashboard Main Card */}
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    bg="white"
                    p={8}
                    borderRadius="3xl"
                    boxShadow="subtle"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    {/* Consolidated Search Bar */}
                    <HStack mb={8} gap={4}>
                        <Box flex={1} position="relative">
                            <Input
                                placeholder="Pesquisar por nome, preço ou descrição..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                pl={12}
                                h="56px"
                                rounded="2xl"
                                bg="gray.50"
                                border="none"
                                _focus={{
                                    bg: "white",
                                    boxShadow: "0 0 0 2px rgba(50, 18, 77, 0.1)",
                                    borderColor: "zazuu.purple"
                                }}
                                transition="all 0.3s"
                            />
                            <Box position="absolute" left={4} top="50%" transform="translateY(-50%)" color="zazuu.purple">
                                <Search size={22} />
                            </Box>
                        </Box>
                        <Button
                            variant="outline"
                            h="56px"
                            px={6}
                            rounded="2xl"
                            borderColor="gray.200"
                            color="gray.600"
                            _hover={{ bg: 'gray.50' }}
                        >
                            <Filter size={18} style={{ marginRight: '8px' }} /> Filtros
                        </Button>
                    </HStack>

                    {/* Table Section */}
                    <Box overflow="hidden" rounded="2xl" border="1px solid" borderColor="gray.100">
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
                                {loading && products.length === 0 ? (
                                    // Skeleton Loaders
                                    Array(5).fill(0).map((_, i) => (
                                        <Table.Row key={`skeleton-${i}`}>
                                            <Table.Cell py={6}><Skeleton h="20px" w="150px" rounded="md" /></Table.Cell>
                                            <Table.Cell py={6}><Skeleton h="20px" w="80%" rounded="md" /></Table.Cell>
                                            <Table.Cell py={6} textAlign="end"><Skeleton h="20px" w="60px" ml="auto" rounded="md" /></Table.Cell>
                                            <Table.Cell py={6} textAlign="end"><Skeleton h="20px" w="80px" ml="auto" rounded="md" /></Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {products.length > 0 ? (
                                            products.map((product, index) => (
                                                <MotionTableRow 
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ 
                                                        opacity: 1, 
                                                        y: 0,
                                                        transition: { 
                                                            delay: index * 0.05,
                                                            duration: 0.4,
                                                            ease: "easeOut"
                                                        }
                                                    }}
                                                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } as any }}
                                                    _hover={{ bg: 'gray.50/80' }}
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
                                                                whileHover={{ scale: 1.1, backgroundColor: 'white', boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                                                                whileTap={{ scale: 0.9 }}
                                                                aria-label="Editar" size="sm" variant="outline"
                                                                rounded="full"
                                                                onClick={() => handleEditClick(product)}
                                                                borderColor="gray.100"
                                                                color="zazuu.purple"
                                                            >
                                                                <Edit3 size={16} />
                                                            </MotionIconButton>
                                                            <MotionIconButton
                                                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(254, 242, 242, 1)', color: 'rgba(220, 38, 38, 1)', boxShadow: "0 4px 12px rgba(220, 38, 38, 0.1)" }}
                                                                whileTap={{ scale: 0.9 }}
                                                                aria-label="Deletar" size="sm" variant="ghost"
                                                                rounded="full"
                                                                color="gray.400"
                                                                onClick={() => triggerDelete(product)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </MotionIconButton>
                                                        </HStack>
                                                    </Table.Cell>
                                                </MotionTableRow>
                                            ))
                                        ) : (
                                            <Table.Row>
                                                <Table.Cell colSpan={4} textAlign="center" py={20}>
                                                    <VStack gap={2}>
                                                        <Text color="gray.400" fontSize="lg">Nenhum produto encontrado.</Text>
                                                        <Button variant="ghost" color="zazuu.purple" onClick={() => setSearchTerm('')}>
                                                            Limpar filtros
                                                        </Button>
                                                    </VStack>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </AnimatePresence>
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Box>
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
        </Box>
    );
}
