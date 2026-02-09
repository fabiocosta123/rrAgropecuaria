import { redirect } from "next/navigation";

export default function RootPage() {
  // Quando o usuário acessa  ele é empurrado para o dashboard
  redirect("/dashboard");
}