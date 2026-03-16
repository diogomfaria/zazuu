'use client';

import { 
    Box, Button, Drawer, Input, VStack, Text, 
    HStack, createToaster, Separator, Portal
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

const toaster = createToaster({ placement: 'bottom-end' });

const MotionButton = motion(Button);

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        minPrice: string;
        maxPrice: string;
    };
    onApply: (filters: { minPrice: string; maxPrice: string }) => void;
    onReset: () => void;
}

export function FilterDrawer({ isOpen, onClose, filters, onApply, onReset }: FilterDrawerProps) {
    const [localMin, setLocalMin] = useState(filters.minPrice);
    const [localMax, setLocalMax] = useState(filters.maxPrice);

    useEffect(() => {
        setLocalMin(filters.minPrice);
        setLocalMax(filters.maxPrice);
    }, [filters]);

    const handleApply = () => {
        onApply({ minPrice: localMin, maxPrice: localMax });
        onClose();
    };

    const handleReset = () => {
        setLocalMin('');
        setLocalMax('');
        onReset();
        onClose();
    };

    const inputStyles = {
        rounded: "xl" as const,
        size: "lg" as "lg" | "sm" | "md" | "xl" | "2xl" | "2xs" | "xs",
        borderColor: "gray.200",
        bg: "gray.50",
        _placeholder: { color: "gray.400", transition: "color 0.2s" },
        _focus: { 
            borderColor: "zazuu.purple", 
            boxShadow: "0 0 0 4px rgba(50, 18, 77, 0.08)",
            bg: "white",
            outline: "none",
            _placeholder: { color: "gray.300" }
        },
        _hover: { borderColor: "gray.300" },
        transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
    };

    return (
        <Drawer.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="end">
            <Portal>
                <Drawer.Backdrop 
                    bg="blackAlpha.400" 
                    backdropFilter="blur(4px)"
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] } as any}
                />
                <Drawer.Positioner>
                    <Drawer.Content 
                        bg="white" 
                        p={0} 
                        h="100vh"
                        maxW="400px"
                        boxShadow="-10px 0 30px rgba(0,0,0,0.05)"
                        border="none"
                    >
                        <Box p={8} h="full" display="flex" flexDirection="column">
                            {/* Header */}
                            <HStack justify="space-between" mb={10}>
                                <VStack align="start" gap={1}>
                                    <DrawerHeading size="md" color="zazuu.purple">Filtros</DrawerHeading>
                                    <Text color="gray.500" fontSize="sm" fontWeight="medium">Refine sua busca por produtos</Text>
                                </VStack>
                                <IconButton 
                                    onClick={onClose} 
                                    rounded="full"
                                    _hover={{ bg: 'gray.100' }}
                                >
                                    <X size={22} color="#4A5568" />
                                </IconButton>
                            </HStack>

                            {/* Body */}
                            <VStack gap={8} flex={1} align="stretch">
                                <Box>
                                    <Text fontWeight="bold" mb={4} color="gray.700" fontSize="xs" letterSpacing="wider">FAIXA DE PREÇO (R$)</Text>
                                    <VStack gap={4}>
                                        <Box w="full">
                                            <Text fontSize="xs" color="gray.500" mb={2} fontWeight="semibold">Mínimo</Text>
                                            <Input 
                                                placeholder="0,00" 
                                                value={localMin}
                                                onChange={(e) => setLocalMin(e.target.value)}
                                                {...inputStyles}
                                            />
                                        </Box>
                                        <Box w="full">
                                            <Text fontSize="xs" color="gray.500" mb={2} fontWeight="semibold">Máximo</Text>
                                            <Input 
                                                placeholder="∞" 
                                                value={localMax}
                                                onChange={(e) => setLocalMax(e.target.value)}
                                                {...inputStyles}
                                            />
                                        </Box>
                                    </VStack>
                                </Box>
                                
                                <Separator borderColor="gray.100" />
                            </VStack>

                            {/* Footer */}
                            <VStack gap={4} mt="auto">
                                <MotionButton
                                    whileHover={{ scale: 1.01, translateY: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    bg="zazuu.purple"
                                    color="white"
                                    w="full"
                                    h="60px"
                                    rounded="full"
                                    fontWeight="bold"
                                    fontSize="md"
                                    onClick={handleApply}
                                    _hover={{ bg: '#250d3a' }}
                                    boxShadow="0 4px 12px rgba(50, 18, 77, 0.2)"
                                >
                                    Aplicar Filtros
                                </MotionButton>
                                <Button
                                    variant="ghost"
                                    color="gray.500"
                                    w="full"
                                    rounded="full"
                                    h="50px"
                                    onClick={handleReset}
                                    _hover={{ bg: 'gray.50', color: 'gray.800' }}
                                    fontSize="sm"
                                    fontWeight="semibold"
                                >
                                    <RotateCcw size={16} style={{ marginRight: '8px' }} /> Limpar Tudo
                                </Button>
                            </VStack>
                        </Box>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}

function DrawerHeading({ children, size, color }: { children: React.ReactNode; size: "sm" | "md" | "lg" | "xl" | "2xl"; color?: string }) {
    const fontSize = {
        sm: "xl",
        md: "2xl",
        lg: "3xl",
        xl: "4xl",
        "2xl": "5xl"
    }[size];

    return (
        <Text 
            fontSize={fontSize} 
            fontWeight="bold" 
            color={color}
            lineHeight="1.2"
        >
            {children}
        </Text>
    );
}

function IconButton({ children, onClick, rounded, _hover }: any) {
    return (
        <Box 
            as="button" 
            onClick={onClick} 
            p={2} 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            borderRadius={rounded}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] } as any}
            _hover={_hover}
            outline="none"
        >
            {children}
        </Box>
    );
}
