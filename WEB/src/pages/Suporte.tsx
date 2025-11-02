import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Suporte = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    problema: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.problema) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    toast.success("Mensagem enviada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 p-4 flex items-center justify-center">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="animate-slide-in shadow-xl border-2 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center">
              Suporte ao Usuário
            </CardTitle>
            <CardDescription className="text-center text-base">
              Estamos aqui para ajudar! Envie sua mensagem e retornaremos em
              breve.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="nome"
                    className="text-base flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Digite seu nome completo"
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-base flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="seu.email@exemplo.com"
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="problema"
                    className="text-base flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Descreva seu problema
                  </Label>
                  <Textarea
                    id="problema"
                    value={formData.problema}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        problema: e.target.value,
                      })
                    }
                    placeholder="Conte-nos com detalhes qual é o problema que você está enfrentando..."
                    className="min-h-[120px] text-base resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.problema.length}/500 caracteres
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold hover:scale-[1.02] transition-transform"
                size="lg"
              >
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Suporte;
