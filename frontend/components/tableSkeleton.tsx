'use client';

import { Table, Skeleton, HStack, Box } from '@chakra-ui/react';

export function TableSkeleton() {
    return (
        <>
            {Array(5).fill(0).map((_, i) => (
                <Table.Row key={`skeleton-${i}`}>
                    <Table.Cell py={6}>
                        <Skeleton h="20px" w="180px" rounded="md" />
                    </Table.Cell>
                    <Table.Cell py={6}>
                        <Skeleton h="20px" w="85%" rounded="md" />
                    </Table.Cell>
                    <Table.Cell py={6} textAlign="end">
                        <Skeleton h="20px" w="70px" ml="auto" rounded="md" />
                    </Table.Cell>
                    <Table.Cell py={6} textAlign="end">
                        <HStack gap={3} justify="end">
                            <Skeleton h="32px" w="32px" rounded="full" />
                            <Skeleton h="32px" w="32px" rounded="full" />
                        </HStack>
                    </Table.Cell>
                </Table.Row>
            ))}
        </>
    );
}
