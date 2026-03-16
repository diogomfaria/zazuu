'use client';

import {
    Toaster as ChakraToaster,
    Portal,
    Stack,
    Toast,
    createToaster,
    HStack,
    Box,
} from '@chakra-ui/react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

export const toaster = createToaster({
    placement: 'bottom-end',
});

export const Toaster = () => {
    const typeConfig = {
        success: { icon: CheckCircle2, accent: 'green.500' },
        error: { icon: XCircle, accent: 'red.500' },
        info: { icon: Info, accent: 'blue.500' },
        warning: { icon: AlertCircle, accent: 'orange.500' },
    } as const;

    return (
        <Portal>
            <ChakraToaster toaster={toaster} insetInline={6} insetBlock={6}>
                {(toast) => {
                    const config = typeConfig[toast.type as keyof typeof typeConfig];
                    const Icon = config?.icon ?? Info;
                    const accent = config?.accent ?? 'gray.500';

                    return (
                    <Toast.Root
                        key={toast.id}
                        bg="rgba(255, 255, 255, 0.92)"
                        border="1px solid"
                        borderColor="gray.200"
                        boxShadow="0 18px 40px rgba(15, 23, 42, 0.12)"
                        borderRadius="2xl"
                        p={0}
                        minW="320px"
                        overflow="hidden"
                        backdropFilter="blur(10px)"
                    >
                        <HStack align="stretch" w="full" gap={0}>
                            <Box
                                w="6px"
                                bg={accent}
                                boxShadow={`0 0 18px var(--chakra-colors-${accent.replace('.', '-')})`}
                            />
                            <HStack gap={4} align="start" w="full" p={4}>
                                <Toast.Indicator mt={0.5}>
                                    <Icon size={18} color={`var(--chakra-colors-${accent.replace('.', '-')})`} />
                                </Toast.Indicator>
                            
                                <Stack gap={1} flex="1">
                                    {toast.title && (
                                        <Toast.Title fontWeight="semibold" color="gray.900" fontSize="sm">
                                            {toast.title}
                                        </Toast.Title>
                                    )}
                                    {toast.description && (
                                        <Toast.Description color="gray.600" fontSize="xs">
                                            {toast.description}
                                        </Toast.Description>
                                    )}
                                </Stack>

                                <Toast.CloseTrigger 
                                    color="gray.400" 
                                    _hover={{ color: "gray.700", bg: "gray.50" }} 
                                    rounded="full"
                                    mt={-2}
                                    mr={-2}
                                    p={2}
                                />
                            </HStack>
                        </HStack>
                    </Toast.Root>
                    );
                }}
            </ChakraToaster>
        </Portal>
    );
};
