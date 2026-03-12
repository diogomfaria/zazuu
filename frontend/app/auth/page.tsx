'use client';

import { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Text, Tabs, Container, createToaster } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

const toaster = createToaster({ placement: 'bottom-end' });

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const router = useRouter();

    const handleAuth = async (mode: 'login' | 'register') => {
        setLoading(true);
        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
            const payload = mode === 'login' ? { email, password } : { name, email, password };

            const { data } = await api.post(endpoint, payload);

            if (mode === 'login') {
                localStorage.setItem('@Zazuu:token', data.access_token);
                toaster.create({ title: 'Sucesso!', type: 'success', duration: 3000 });
                router.push('/dashboard');
            } else {
                toaster.create({ title: 'Conta criada! Faça login.', type: 'success' });
            }
        } catch (error: any) {
            toaster.create({
                title: 'Erro na autenticação',
                description: error.response?.data?.message || 'Erro inesperado',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="md" centerContent py={20}>
            <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" w="100%" bg="white">
                <VStack mb={6}>
                    <Heading size="lg">Zazuu Admin</Heading>
                    <Text color="gray.500">Gerencie seus produtos pet</Text>
                </VStack>

                <Tabs.Root defaultValue="login" fitted variant="enclosed">
                    <Tabs.List mb="1em">
                        <Tabs.Trigger value="login">Login</Tabs.Trigger>
                        <Tabs.Trigger value="register">Cadastro</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="login">
                        <VStack gap={4}>
                            <Box w="full">
                                <Text fontWeight="medium" mb={1} as="label">E-mail</Text>
                                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Box>
                            <Box w="full">
                                <Text fontWeight="medium" mb={1} as="label">Senha</Text>
                                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Box>
                            <Button colorScheme="blue" w="100%" loading={loading} onClick={() => handleAuth('login')}>
                                Entrar
                            </Button>
                        </VStack>
                    </Tabs.Content>

                    <Tabs.Content value="register">
                        <VStack gap={4}>
                            <Box w="full">
                                <Text fontWeight="medium" mb={1} as="label">Nome</Text>
                                <Input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                            </Box>
                            <Box w="full">
                                <Text fontWeight="medium" mb={1} as="label">E-mail</Text>
                                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Box>
                            <Box w="full">
                                <Text fontWeight="medium" mb={1} as="label">Senha</Text>
                                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Box>
                            <Button colorScheme="green" w="100%" loading={loading} onClick={() => handleAuth('register')}>
                                Criar Conta
                            </Button>
                        </VStack>
                    </Tabs.Content>
                </Tabs.Root>
            </Box>
        </Container>
    );
}