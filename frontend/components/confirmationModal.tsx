'use client';

import { 
    Button, Dialog, Box, Text, Portal, VStack, HStack 
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const MotionDialogContent = motion(Dialog.Content);

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    loading?: boolean;
}

export function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description,
    loading 
}: ConfirmationModalProps) {
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
                        maxW="400px"
                        zIndex="2200"
                        opacity="1 !important"
                    >
                        <VStack gap={6} align="center" textAlign="center">
                            <Box 
                                bg="red.50" 
                                p={4} 
                                rounded="full" 
                                color="red.500"
                            >
                                <AlertCircle size={32} />
                            </Box>
                            
                            <Box>
                                <Dialog.Title fontWeight="bold" fontSize="xl" mb={2} color="zazuu.purple">
                                    {title}
                                </Dialog.Title>
                                <Dialog.Description color="gray.500">
                                    {description}
                                </Dialog.Description>
                            </Box>

                            <HStack w="full" gap={4}>
                                <Button 
                                    variant="ghost" 
                                    flex={1} 
                                    onClick={onClose}
                                    rounded="full"
                                    disabled={loading}
                                    color="gray.500"
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    bg="red.500" 
                                    color="white" 
                                    flex={1} 
                                    onClick={onConfirm}
                                    loading={loading}
                                    rounded="full"
                                    _hover={{ bg: 'red.600' }}
                                >
                                    Confirmar
                                </Button>
                            </HStack>
                        </VStack>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
