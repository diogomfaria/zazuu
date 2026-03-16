'use client';

import { Box, HStack, VStack, Text, IconButton, Button } from '@chakra-ui/react';
import { Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number;
}

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    index: number;
}

const MotionBox = motion(Box);

export const ProductCard = ({ product, onEdit, onDelete, index }: ProductCardProps) => {
    return (
        <MotionBox
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                ease: [0.25, 1, 0.5, 1] 
            }}
            bg="white"
            p={5}
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="sm"
            w="full"
        >
            <VStack align="stretch" gap={4}>
                {/* Header: Name and Price */}
                <HStack justify="space-between" align="start">
                    <Text fontWeight="bold" color="zazuu.purple" fontSize="lg" flex={1}>
                        {product.name}
                    </Text>
                    <Text fontWeight="black" color="gray.800">
                        R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                </HStack>

                {/* Description: Truncated */}
                <Text color="gray.500" fontSize="sm" lineClamp={2} minH="40px">
                    {product.description}
                </Text>

                {/* Actions: Bottom Row */}
                <HStack justify="flex-end" gap={3} pt={2} borderTop="1px solid" borderColor="gray.50">
                    <Button
                        size="md"
                        variant="outline"
                        rounded="full"
                        onClick={() => onEdit(product)}
                        borderColor="gray.100"
                        color="zazuu.purple"
                        fontSize="sm"
                        h={{ base: '44px', md: '36px' }}
                        px={6}
                        _hover={{ bg: 'gray.50' }}
                    >
                        <Edit3 size={16} style={{ marginRight: '8px' }} /> Editar
                    </Button>
                    <IconButton
                        aria-label="Excluir"
                        variant="ghost"
                        rounded="full"
                        onClick={() => onDelete(product)}
                        color="gray.400"
                        _hover={{ bg: 'red.50', color: 'red.500' }}
                        h={{ base: '44px', md: '36px' }}
                        w={{ base: '44px', md: '36px' }}
                    >
                        <Trash2 size={18} />
                    </IconButton>
                </HStack>
            </VStack>
        </MotionBox>
    );
};
