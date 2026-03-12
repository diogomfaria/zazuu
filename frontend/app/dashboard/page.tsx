'use client';

import { useEffect, useState } from 'react';
import {
    Box, Container, Heading, Button, Table,
    Input, HStack, useDisclosure, IconButton, Text, Spinner, createToaster
} from '@chakra-ui/react';
import { Plus, Search, Trash2, Edit3, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { ProductModal } from '@/components/productModal';

const toaster = createToaster({ placement: 'bottom-end' });

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
}

export default function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const { open, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const fetchProducts = async (nameFilter = '') => {
        setLoading(true);
        try {
            const { data } = await api.get(`/products${nameFilter ? `?name=${nameFilter}` : ''}`);
            setProducts(data);
        } catch (error) {
            toaster.create({ title: 'Erro ao carregar produtos', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Debounce para busca automática
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(search);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

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

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter(p => p.id !== id));
            toaster.create({ title: 'Produto removido', type: 'info' });
        } catch (error) {
            toaster.create({ title: 'Erro ao remover', type: 'error' });
        }
    };

    const handleEditClick = (product: Product) => {
        setProductToEdit(product);
        onOpen();
    };

    const handleNewClick = () => {
        setProductToEdit(null);
        onOpen();
    };

    const handleModalClose = () => {
        setProductToEdit(null);
        onClose();
    };

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="container.lg">
                <HStack justify="space-between" mb={8}>
                    <Heading size="lg" color="blue.600">Meus Produtos Pet</Heading>
                    <Button variant="ghost" onClick={handleLogout} colorPalette="gray">
                        <LogOut size={18} /> Sair
                    </Button>
                </HStack>

                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                    <HStack mb={6} gap={4}>
                        <Box flex={1} position="relative">
                            <Input
                                placeholder="Filtrar por nome..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                pl={10}
                            />
                            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400">
                                <Search size={18} />
                            </Box>
                            {search && (
                                <IconButton
                                    aria-label="Limpar busca"
                                    variant="ghost"
                                    size="sm"
                                    position="absolute"
                                    right={2}
                                    top="50%"
                                    transform="translateY(-50%)"
                                    onClick={() => setSearch('')}
                                >
                                    <Trash2 size={14} />
                                </IconButton>
                            )}
                        </Box>
                        <Button colorPalette="blue" onClick={handleNewClick} px={8}>
                            <Plus size={18} /> Novo Produto
                        </Button>
                    </HStack>

                    {loading && products.length === 0 ? (
                        <Box textAlign="center" py={10}><Spinner /></Box>
                    ) : (
                        <Table.Root variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                    <Table.ColumnHeader>Descrição</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end">Preço</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {products.length > 0 ? products.map((product) => (
                                    <Table.Row key={product.id}>
                                        <Table.Cell fontWeight="bold">{product.name}</Table.Cell>
                                        <Table.Cell color="gray.600">{product.description}</Table.Cell>
                                        <Table.Cell textAlign="end">R$ {Number(product.price).toFixed(2)}</Table.Cell>
                                        <Table.Cell textAlign="end">
                                            <HStack gap={2} justify="end">
                                                <IconButton 
                                                    aria-label="Editar" 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleEditClick(product)}
                                                >
                                                    <Edit3 size={16} />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="Deletar"
                                                    size="sm"
                                                    variant="ghost"
                                                    colorPalette="red"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </HStack>
                                        </Table.Cell>
                                    </Table.Row>
                                )) : (
                                    <Table.Row><Table.Cell colSpan={4} textAlign="center" py={10}>Nenhum produto encontrado.</Table.Cell></Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Box>
            </Container>
            <ProductModal
                isOpen={open}
                onClose={handleModalClose}
                onSuccess={() => fetchProducts(search)}
                productToEdit={productToEdit}
            />
        </Box>
    );
}