'use client';

import { useEffect, useState } from 'react';
import {
    Button, Input, Textarea, VStack, createToaster, Dialog, NumberInput, Box, Text, Portal
} from '@chakra-ui/react';
import { api } from '@/services/api';

const toaster = createToaster({ placement: 'bottom-end' });

interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setDescription(productToEdit.description);
            // Formata do BD (decimal ponto) para Visualização BR (string vírgula)
            setPrice(Number(productToEdit.price).toFixed(2).replace(".", ","));
        } else {
            setName('');
            setDescription('');
            setPrice('');
        }
    }, [productToEdit, isOpen]);

    const handleSubmit = async () => {

        setLoading(true);

        if (!name || !description || !price) {
            toaster.create({ title: 'Preencha todos os campos', type: 'warning' });
            setLoading(false);
            return;
        }

        try {
            // "12,50" -> "12.50" -> parseFloat
            const rawPrice = parseFloat(price.replace(",", "."));
            const payload = { name, description, price: rawPrice };
            
            if (productToEdit) {
                await api.put(`/products/${productToEdit.id}`, payload);
                toaster.create({ title: 'Produto atualizado!', type: 'success' });
            } else {
                await api.post('/products', payload);
                toaster.create({ title: 'Produto cadastrado!', type: 'success' });
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            toaster.create({
                title: 'Erro na operação',
                description: error.response?.data?.message || 'Erro inesperado',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{productToEdit ? 'Editar Produto' : 'Novo Produto'}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger />

                        <Dialog.Body>
                            <VStack gap={4}>
                                <Box w="full">
                                    <Text fontWeight="medium" mb={1} as="label">Nome do Produto <Text as="span" color="red.500">*</Text></Text>
                                    <Input
                                        placeholder="Ex: Ração Premium"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Box>

                                <Box w="full">
                                    <Text fontWeight="medium" mb={1} as="label">Descrição <Text as="span" color="red.500">*</Text></Text>
                                    <Textarea
                                        placeholder="Detalhes do produto..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </Box>

                                <Box w="full">
                                    <Text fontWeight="medium" mb={1} as="label">Preço (R$) <Text as="span" color="red.500">*</Text></Text>
                                    <Input
                                        placeholder="0,00"
                                        value={price}
                                        onChange={(e) => {
                                            // Handle masking (Numbers only, converted to decimal)
                                            let val = e.target.value.replace(/\D/g, "");
                                            if (val.length === 0) {
                                                setPrice("");
                                                return;
                                            }
                                            // Converte para decimal
                                            const decimalValue = (Number(val) / 100).toFixed(2);
                                            // Troca ponto por vírgula para visualização HUE BR
                                            setPrice(decimalValue.replace(".", ","));
                                        }}
                                        required
                                        inputMode="numeric"
                                    />
                                </Box>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
                            <Button colorScheme="blue" loading={loading} onClick={handleSubmit}>
                                {productToEdit ? 'Salvar Alterações' : 'Cadastrar'}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}