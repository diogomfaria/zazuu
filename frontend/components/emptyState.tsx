'use client';

import { VStack, Text, Button, Box, Icon } from '@chakra-ui/react';
import { PackageSearch } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const MotionVStack = motion(VStack);

interface EmptyStateProps {
    onAction: () => void;
}

export function EmptyState({ onAction }: EmptyStateProps) {
    return (
        <MotionVStack 
            py={20} 
            gap={6} 
            textAlign="center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] } as any}
        >
            <MotionBox
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 1, 0.5, 1] } as any}
            >
                <PackageSearch size={64} strokeWidth={1} color="var(--chakra-colors-gray-300)" />
            </MotionBox>
            
            <VStack gap={2}>
                <Text fontSize="xl" fontWeight="semibold" color="gray.600">
                    Nenhum produto encontrado
                </Text>
                <Text color="gray.400" fontSize="md" maxW="xs">
                    Sua listagem está vazia no momento. Adicione produtos para começar a gerenciar seu estoque.
                </Text>
            </VStack>

            <Button
                variant="solid"
                bg="zazuu.purple"
                color="white"
                rounded="full"
                size="lg"
                px={8}
                onClick={onAction}
                _hover={{ 
                    bg: '#250d3a',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 15px rgba(50, 18, 77, 0.2)'
                }}
                transition="all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
                mt={2}
            >
                Novo Produto
            </Button>
        </MotionVStack>
    );
}
