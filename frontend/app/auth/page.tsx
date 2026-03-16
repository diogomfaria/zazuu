'use client';

import { useState } from 'react';
import { 
    Box, VStack, Heading, Text, Input, Button, Tabs, Container
} from '@chakra-ui/react';
import { LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/logo';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [activeTab, setActiveTab] = useState('login');
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
        <Box minH="100vh" bg={{ base: 'white', md: 'brand.bg' }} className="font-outfit" py={{ base: 0, md: 32 }}>
            <Container maxW={{ base: 'full', md: 'md' }} p={{ base: 0, md: 4 }}>
                <MotionBox 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    p={{ base: 8, md: 12 }} 
                    borderRadius={{ base: 'none', md: '3xl' }} 
                    boxShadow={{ base: 'none', md: 'subtle' }} 
                    w="100%" 
                    minH={{ base: '100vh', md: 'auto' }}
                    bg="white"
                    border={{ base: 'none', md: '1px solid' }}
                    borderColor="gray.100"
                    display="flex"
                    flexDir="column"
                    justifyContent={{ base: 'center', md: 'flex-start' }}
                >
                    <VStack mb={{ base: 6, md: 8 }} gap={2} w="full">
                        <Logo width={160} height={60} />
                        <Text color="gray.500" fontSize={{ base: "md", md: "lg" }} textAlign="center">Gerencie seus produtos pet</Text>
                    </VStack>

                    <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)} fitted variant="plain">
                        <Tabs.List mb={8} bg="gray.100" p={1.5} rounded="full" position="relative" gap={1}>
                            <Tabs.Trigger 
                                value="login" 
                                zIndex={1}
                                rounded="full" 
                                fontWeight="bold"
                                color={activeTab === 'login' ? 'white' : 'gray.500'}
                                transition="color 0.3s ease"
                                _hover={{ color: activeTab === 'login' ? 'white' : 'zazuu.purple' }}
                                py={2.5}
                                flex={1}
                                position="relative"
                            >
                                Login
                                {activeTab === 'login' && (
                                    <motion.div
                                        layoutId="active-pill"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: '#32124d',
                                            borderRadius: '9999px',
                                            zIndex: -1
                                        }}
                                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                    />
                                )}
                            </Tabs.Trigger>
                            <Tabs.Trigger 
                                value="register" 
                                zIndex={1}
                                rounded="full" 
                                fontWeight="bold"
                                color={activeTab === 'register' ? 'white' : 'gray.500'}
                                transition="color 0.3s ease"
                                _hover={{ color: activeTab === 'register' ? 'white' : 'zazuu.purple' }}
                                py={2.5}
                                flex={1}
                                position="relative"
                            >
                                Cadastro
                                {activeTab === 'register' && (
                                    <motion.div
                                        layoutId="active-pill"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: '#32124d',
                                            borderRadius: '9999px',
                                            zIndex: -1
                                        }}
                                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                    />
                                )}
                            </Tabs.Trigger>
                        </Tabs.List>

                        <AnimatePresence mode="wait">
                            <Tabs.Content value="login" key="login">
                                <MotionBox
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <VStack gap={6}>
                                        <Box w="full">
                                            <Text fontWeight="semibold" mb={2} as="label">E-mail</Text>
                                            <Input 
                                                type="email" 
                                                required 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)} 
                                                placeholder="seu@email.com"
                                                rounded="xl"
                                                size="lg"
                                                borderColor="gray.200"
                                                _placeholder={{ color: "gray.400", transition: "color 0.2s" }}
                                                _focus={{ 
                                                    borderColor: "zazuu.purple", 
                                                    boxShadow: "0 0 0 4px rgba(50, 18, 77, 0.08)",
                                                    bg: "white",
                                                    outline: "none",
                                                    _placeholder: { color: "gray.300" }
                                                }}
                                                _hover={{ borderColor: "gray.300" }}
                                                transition="all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
                                            />
                                        </Box>
                                        <Box w="full">
                                            <Text fontWeight="semibold" mb={2} as="label">Senha</Text>
                                            <Input 
                                                type="password" 
                                                required 
                                                value={password} 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                placeholder="••••••••"
                                                rounded="xl"
                                                size="lg"
                                                borderColor="gray.200"
                                                _placeholder={{ color: "gray.400", transition: "color 0.2s" }}
                                                _focus={{ 
                                                    borderColor: "zazuu.purple", 
                                                    boxShadow: "0 0 0 4px rgba(50, 18, 77, 0.08)",
                                                    bg: "white",
                                                    outline: "none",
                                                    _placeholder: { color: "gray.300" }
                                                }}
                                                _hover={{ borderColor: "gray.300" }}
                                                transition="all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
                                            />
                                        </Box>
                                        <MotionButton 
                                            whileHover={!loading ? { scale: 1.01, translateY: -1 } : {}}
                                            whileTap={!loading ? { scale: 0.99 } : {}}
                                            bg="zazuu.purple" 
                                            color="white"
                                            w="100%" 
                                            size="lg"
                                            rounded="full"
                                            fontWeight="bold"
                                            onClick={() => !loading && handleAuth('login')}
                                            _hover={{ bg: '#250d3a' }}
                                            mt={4}
                                            position="relative"
                                            overflow="hidden"
                                            disabled={loading}
                                            cursor={loading ? "not-allowed" : "pointer"}
                                        >
                                            <AnimatePresence mode="wait">
                                                {loading ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                                    >
                                                        <motion.span
                                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        >
                                                            Autenticando...
                                                        </motion.span>
                                                    </motion.div>
                                                ) : (
                                                    <motion.span
                                                        key="text"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                    >
                                                        Entrar
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </MotionButton>
                                    </VStack>
                                </MotionBox>
                            </Tabs.Content>

                            <Tabs.Content value="register" key="register">
                                <MotionBox
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <VStack gap={6}>
                                        <Box w="full">
                                            <Text fontWeight="semibold" mb={2} as="label">Nome</Text>
                                            <Input 
                                                type="text" 
                                                required 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)} 
                                                placeholder="Nome completo"
                                                rounded="xl"
                                                size="lg"
                                                borderColor="gray.200"
                                                _placeholder={{ color: "gray.400", transition: "color 0.2s" }}
                                                _focus={{ 
                                                    borderColor: "zazuu.purple", 
                                                    boxShadow: "0 0 0 4px rgba(50, 18, 77, 0.08)",
                                                    bg: "white",
                                                    outline: "none",
                                                    _placeholder: { color: "gray.300" }
                                                }}
                                                _hover={{ borderColor: "gray.300" }}
                                                transition="all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
                                            />
                                        </Box>
                                        <Box w="full">
                                            <Text fontWeight="semibold" mb={2} as="label">E-mail</Text>
                                            <Input 
                                                type="email" 
                                                required 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)} 
                                                placeholder="seu@email.com"
                                                rounded="xl"
                                                size="lg"
                                                borderColor="gray.200"
                                                _placeholder={{ color: "gray.400", transition: "color 0.2s" }}
                                                _focus={{ 
                                                    borderColor: "zazuu.purple", 
                                                    boxShadow: "0 0 0 4px rgba(50, 18, 77, 0.08)",
                                                    bg: "white",
                                                    outline: "none",
                                                    _placeholder: { color: "gray.300" }
                                                }}
                                                _hover={{ borderColor: "gray.300" }}
                                                transition="all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
                                            />
                                        </Box>
                                        <Box w="full">
                                            <Text fontWeight="semibold" mb={2} as="label">Senha</Text>
                                            <Input 
                                                type="password" 
                                                required 
                                                value={password} 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                placeholder="Crie uma senha forte"
                                                rounded="xl"
                                                size="lg"
                                                borderColor="gray.200"
                                                _placeholder={{ color: "gray.400", transition: "color 0.2s" }}
                                                _focus={{ 
                                                    borderColor: "zazuu.purple", 
                                                    boxShadow: "0 0 0 4px rgba(50, 18, 77, 0.08)",
                                                    bg: "white",
                                                    outline: "none",
                                                    _placeholder: { color: "gray.300" }
                                                }}
                                                _hover={{ borderColor: "gray.300" }}
                                                transition="all 0.2s"
                                            />
                                        </Box>
                                        <MotionButton 
                                            whileHover={!loading ? { scale: 1.01, translateY: -1 } : {}}
                                            whileTap={!loading ? { scale: 0.99 } : {}}
                                            bg="zazuu.lime" 
                                            color="#292929"
                                            w="100%" 
                                            size="lg"
                                            rounded="full"
                                            fontWeight="bold"
                                            onClick={() => !loading && handleAuth('register')}
                                            _hover={{ bg: '#c1e245' }}
                                            mt={4}
                                            position="relative"
                                            overflow="hidden"
                                            disabled={loading}
                                            cursor={loading ? "not-allowed" : "pointer"}
                                        >
                                            <AnimatePresence mode="wait">
                                                {loading ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                                    >
                                                        <motion.span
                                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                        >
                                                            Criando conta...
                                                        </motion.span>
                                                    </motion.div>
                                                ) : (
                                                    <motion.span
                                                        key="text"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                    >
                                                        Criar Conta
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </MotionButton>
                                    </VStack>
                                </MotionBox>
                            </Tabs.Content>
                        </AnimatePresence>
                    </Tabs.Root>
                </MotionBox>
            </Container>
        </Box>
    );
}