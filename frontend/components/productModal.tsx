'use client';

import { useEffect, useState } from 'react';
import {
    Button, Input, Textarea, VStack, createToaster, Dialog, Box, Text, Portal
} from '@chakra-ui/react';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

const toaster = createToaster({ placement: 'bottom-end' });

const MotionBox = motion(Box);
const MotionButton = motion(Button);

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

interface ProductFormProps {
    productToEdit?: Product | null;
    onSuccess: () => void;
    onClose: () => void;
}

function ProductForm({ productToEdit, onSuccess, onClose }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(productToEdit?.name || '');
    const [description, setDescription] = useState(productToEdit?.description || '');
    const [price, setPrice] = useState(
        productToEdit
            ? Number(productToEdit.price).toFixed(2).replace(".", ",")
            : ''
    );

    const handleSubmit = async () => {
        setLoading(true);
        if (!name || !description || !price) {
            toaster.create({ title: 'Preencha todos os campos', type: 'warning' });
            setLoading(false);
            return;
        }

        try {
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
        <>
            <Dialog.Body>
                <VStack gap={6}>
                    <Box w="full">
                        <Text fontWeight="semibold" mb={2} as="label">Nome do Produto <Text as="span" color="red.500">*</Text></Text>
                        <Input
                            placeholder="Ex: Ração Premium"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            rounded="xl"
                            size="lg"
                            borderColor="gray.200"
                            _focus={{
                                borderColor: "#32124d",
                                boxShadow: "0 0 0 1px #32124d",
                                bg: "white"
                            }}
                            _hover={{ borderColor: "gray.300" }}
                            transition="all 0.2s"
                        />
                    </Box>

                    <Box w="full">
                        <Text fontWeight="semibold" mb={2} as="label">Descrição <Text as="span" color="red.500">*</Text></Text>
                        <Textarea
                            placeholder="Detalhes do produto..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rounded="xl"
                            size="lg"
                            minH="120px"
                            borderColor="gray.200"
                            _focus={{
                                borderColor: "#32124d",
                                boxShadow: "0 0 0 1px #32124d",
                                bg: "white"
                            }}
                            _hover={{ borderColor: "gray.300" }}
                            transition="all 0.2s"
                        />
                    </Box>

                    <Box w="full">
                        <Text fontWeight="semibold" mb={2} as="label">Preço (R$) <Text as="span" color="red.500">*</Text></Text>
                        <Input
                            placeholder="0,00"
                            value={price}
                            onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, "");
                                if (val.length === 0) {
                                    setPrice("");
                                    return;
                                }
                                const decimalValue = (Number(val) / 100).toFixed(2);
                                setPrice(decimalValue.replace(".", ","));
                            }}
                            required
                            rounded="xl"
                            size="lg"
                            inputMode="numeric"
                            borderColor="gray.200"
                            _focus={{
                                borderColor: "#32124d",
                                boxShadow: "0 0 0 1px #32124d",
                                bg: "white"
                            }}
                            _hover={{ borderColor: "gray.300" }}
                            transition="all 0.2s"
                        />
                    </Box>
                </VStack>
            </Dialog.Body>

            <Dialog.Footer pt={8}>
                <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="ghost" mr={3} onClick={onClose} rounded="full" color="gray.500"
                >
                    Cancelar
                </MotionButton>
                <MotionButton
                    whileHover={!loading ? { scale: 1.01, translateY: -1 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    bg="zazuu.purple"
                    color="white"
                    onClick={handleSubmit}
                    rounded="full"
                    px={8}
                    size="lg"
                    _hover={{ bg: '#250d3a' }}
                    disabled={loading}
                    position="relative"
                    overflow="hidden"
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                Processando...
                            </motion.div>
                        ) : (
                            <motion.span
                                key="text"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </MotionButton>
            </Dialog.Footer>
        </>
    );
}

export function ProductModal({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.700" backdropBlur="10px" zIndex="2000" />
                <Dialog.Positioner zIndex="2100">
                    <Dialog.Content
                        borderRadius="16px"
                        p={8}
                        bg="white"
                        boxShadow="0 20px 40px rgba(0,0,0,0.25)"
                        border="1px solid"
                        borderColor="gray.100"
                        position="relative"
                        zIndex="2200"
                        opacity="1 !important"
                    >
                        <Dialog.Header pb={4}>
                            <Dialog.Title fontWeight="bold" color="zazuu.purple" fontSize="2xl">
                                {productToEdit ? 'Editar Produto' : 'Novo Produto'}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger rounded="full" />

                        <ProductForm
                            productToEdit={productToEdit}
                            onSuccess={onSuccess}
                            onClose={onClose}
                        />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}