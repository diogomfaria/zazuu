'use client';

import {
    Toaster as ChakraToaster,
    Portal,
    Stack,
    Toast,
    createToaster,
    HStack,
} from '@chakra-ui/react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export const toaster = createToaster({
    placement: 'bottom-end',
});

export const Toaster = () => {
    return (
        <Portal>
            <ChakraToaster toaster={toaster} insetInline={6} insetBlock={6}>
                {(toast) => (
                    <Toast.Root
                        key={toast.id}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        boxShadow="0 10px 30px rgba(0,0,0,0.05)"
                        borderRadius="xl"
                        p={4}
                        minW="320px"
                    >
                        <HStack gap={4} align="start" w="full">
                            <Toast.Indicator mt={1}>
                                {toast.type === 'success' && <CheckCircle2 size={18} color="var(--chakra-colors-green-500)" />}
                                {toast.type === 'error' && <XCircle size={18} color="var(--chakra-colors-red-500)" />}
                                {toast.type === 'info' && <Info size={18} color="var(--chakra-colors-blue-500)" />}
                                {toast.type === 'warning' && <AlertCircle size={18} color="var(--chakra-colors-orange-500)" />}
                            </Toast.Indicator>
                            
                            <Stack gap={1} flex="1">
                                {toast.title && (
                                    <Toast.Title fontWeight="semibold" color="gray.800" fontSize="sm">
                                        {toast.title}
                                    </Toast.Title>
                                )}
                                {toast.description && (
                                    <Toast.Description color="gray.500" fontSize="xs">
                                        {toast.description}
                                    </Toast.Description>
                                )}
                            </Stack>

                            <Toast.CloseTrigger 
                                color="gray.300" 
                                _hover={{ color: "gray.500", bg: "gray.50" }} 
                                rounded="full"
                                mt={-2}
                                mr={-2}
                                p={2}
                            />
                        </HStack>
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    );
};
