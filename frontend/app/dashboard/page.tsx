'use client';

import { useEffect, useState } from 'react';
import {
    Box, Container, Heading, Button, Table,
    Input, HStack, useDisclosure, IconButton, Text, Spinner, createToaster
} from '@chakra-ui/react';
import { Plus, Search, Trash2, Edit3, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

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
    const { onOpen, onClose } = useDisclosure();
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

    useEffect(() => {
        const token = localStorage.getItem('@Zazuu:token');
        if (!token) {
            router.push('/auth');
        } else {
            fetchProducts();
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

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="container.lg">
                <HStack justify="space-between" mb={8}>
                    <Heading size="lg" color="blue.600">Meus Produtos Pet</Heading>
                    <Button variant="ghost" onClick={handleLogout}>
                        <LogOut size={18} /> Sair
                    </Button>
                </HStack>

                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                    <HStack mb={6} gap={4}>
                        <Input
                            placeholder="Filtrar por nome..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button colorScheme="blue" onClick={() => fetchProducts(search)}>
                            <Search size={18} /> Filtrar
                        </Button>
                        <Button colorScheme="green" onClick={onOpen}>
                            <Plus size={18} /> Novo Produto
                        </Button>
                    </HStack>

                    {loading ? (
                        <Box textAlign="center" py={10}><Spinner /></Box>
                    ) : (
                        <Table.Root variant="outline">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                    <Table.ColumnHeader>Descrição</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end">Preço</Table.ColumnHeader>
                                    <Table.ColumnHeader>Ações</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {products.length > 0 ? products.map((product) => (
                                    <Table.Row key={product.id}>
                                        <Table.Cell fontWeight="bold">{product.name}</Table.Cell>
                                        <Table.Cell color="gray.600">{product.description}</Table.Cell>
                                        <Table.Cell textAlign="end">R$ {Number(product.price).toFixed(2)}</Table.Cell>
                                        <Table.Cell>
                                            <HStack gap={2}>
                                                <IconButton aria-label="Editar" size="sm" variant="outline">
                                                    <Edit3 size={16} />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="Deletar"
                                                    size="sm"
                                                    colorPalette="red"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </HStack>
                                        </Table.Cell>
                                    </Table.Row>
                                )) : (
                                    <Table.Row><Table.Cell colSpan={4} textAlign="center">Nenhum produto encontrado.</Table.Cell></Table.Row>
                                )}
                            </Table.Body>
                        </Table.Root>
                    )}
                </Box>
            </Container>
        </Box>
    );
}