import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, GraduationCap } from "lucide-react";

const studentSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres").max(100),
  matricula: z.string().min(3, "A matrícula deve ter no mínimo 3 caracteres").max(50),
  course: z.string().min(2, "O curso deve ter no mínimo 2 caracteres").max(100),
  age: z.number().min(1, "A idade deve ser maior que 0").max(150),
  birth_date: z.string().min(1, "A data de nascimento é obrigatória"),
});

const StudentForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    matricula: "",
    course: "",
    age: "",
    birth_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (isEdit) {
      fetchStudent();
    }
  }, [user, isEdit, navigate]);

  const fetchStudent = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        matricula: data.matricula,
        course: data.course,
        age: data.age.toString(),
        birth_date: data.birth_date,
      });
    } catch (error: any) {
      toast.error("Erro ao carregar dados do aluno: " + error.message);
      navigate("/students");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validated = studentSchema.parse({
        ...formData,
        age: parseInt(formData.age),
      });

      const studentData = {
        name: validated.name,
        matricula: validated.matricula,
        course: validated.course,
        age: validated.age,
        birth_date: validated.birth_date,
        user_id: user!.id,
      };

      if (isEdit) {
        const { error } = await supabase
          .from("students")
          .update(studentData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Aluno atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("students")
          .insert([studentData]);

        if (error) {
          if (error.message.includes("duplicate key")) {
            toast.error("Esta matrícula já está cadastrada");
            return;
          }
          throw error;
        }
        toast.success("Aluno cadastrado com sucesso!");
      }

      navigate("/students");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/students")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {isEdit ? "Editar Aluno" : "Novo Aluno"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEdit ? "Atualize os dados do aluno" : "Preencha os dados do novo aluno"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{isEdit ? "Editar Aluno" : "Cadastrar Novo Aluno"}</CardTitle>
            <CardDescription>
              Preencha todos os campos obrigatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite o nome completo"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  placeholder="Digite a matrícula"
                  className={errors.matricula ? "border-destructive" : ""}
                  disabled={isEdit}
                />
                {errors.matricula && (
                  <p className="text-sm text-destructive">{errors.matricula}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Curso *</Label>
                <Input
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="Digite o curso"
                  className={errors.course ? "border-destructive" : ""}
                />
                {errors.course && (
                  <p className="text-sm text-destructive">{errors.course}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Idade *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Digite a idade"
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && (
                    <p className="text-sm text-destructive">{errors.age}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className={errors.birth_date ? "border-destructive" : ""}
                  />
                  {errors.birth_date && (
                    <p className="text-sm text-destructive">{errors.birth_date}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/students")}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Salvando..." : isEdit ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentForm;
