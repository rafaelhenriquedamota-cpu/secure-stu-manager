import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/students");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <nav className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Sistema de Gestão de Alunos</span>
          </div>
          <Button onClick={() => navigate("/auth")}>
            Entrar
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gerencie seus Alunos com Eficiência
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sistema completo para cadastro e gerenciamento de alunos. 
            Controle matrículas, cursos e informações de forma simples e segura.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              <GraduationCap className="h-5 w-5" />
              Começar Agora
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-lg border bg-card text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Cadastro Completo</h3>
            <p className="text-sm text-muted-foreground">
              Registre todos os dados dos alunos: nome, matrícula, curso, idade e data de nascimento
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Fácil Gerenciamento</h3>
            <p className="text-sm text-muted-foreground">
              Edite, visualize e exclua registros de forma intuitiva com interface moderna
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Seguro e Confiável</h3>
            <p className="text-sm text-muted-foreground">
              Sistema com autenticação robusta e proteção de dados dos alunos
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Sistema de Gestão de Alunos © 2025 - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
