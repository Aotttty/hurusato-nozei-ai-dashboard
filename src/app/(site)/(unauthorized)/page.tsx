import { redirect } from "next/navigation";

export default function LandingPage() {
  // メインページにアクセスしたらダッシュボードにリダイレクト
  redirect("/dashboard");
}
