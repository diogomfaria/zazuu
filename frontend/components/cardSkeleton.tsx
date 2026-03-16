'use client';

import { Box, VStack, HStack, Skeleton } from '@chakra-ui/react';

export function CardSkeleton() {
    return (
        <VStack gap={4} w="full">
            {Array(3).fill(0).map((_, i) => (
                <Box 
                    key={`card-skeleton-${i}`} 
                    w="full" 
                    bg="white" 
                    p={5} 
                    borderRadius="2xl" 
                    border="1px solid" 
                    borderColor="gray.100"
                >
                    <VStack align="stretch" gap={4}>
                        <HStack justify="space-between">
                            <Skeleton h="20px" w="40%" rounded="md" />
                            <Skeleton h="20px" w="20%" rounded="md" />
                        </HStack>
                        <Skeleton h="16px" w="100%" rounded="md" />
                        <Skeleton h="16px" w="60%" rounded="md" />
                        <HStack justify="flex-end" gap={3} pt={2}>
                            <Skeleton h="32px" w="80px" rounded="full" />
                            <Skeleton h="32px" w="32px" rounded="full" />
                        </HStack>
                    </VStack>
                </Box>
            ))}
        </VStack>
    );
}
