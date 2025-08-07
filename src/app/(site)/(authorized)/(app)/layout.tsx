import React, { Suspense } from "react";

import AppSidebar from "@/components/organisms/AppSidebar";
import Footer from "@/components/organisms/Footer";
import { UserRepository } from "@/repositories/user_repository";
import { User } from "@/models/user";
import { CheckCircle, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { signOutAction } from "./actions";
import { SidebarProvider, SidebarTrigger } from "@/components/atoms/sidebar";

type Props = {
  children: React.ReactNode;
};

export default async function SiteLayout({ children }: Props) {
  // 認証チェックを無効化
  let me: User | null = null;
  try {
    const repository = new UserRepository();
    me = await repository.getMe();
  } catch (error) {
    console.log(error);
    // エラーが発生しても続行
  }

  const t = await getTranslations("Menu.App");
  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: t("dashboard"),
      href: "/dashboard",
    },
  ];

  return (
    <SidebarProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AppSidebar
          menuItems={menuItems}
          title="ふるさと納税ダッシュボード"
          icon={<CheckCircle className="w-8 h-8 text-blue-600" />}
          signInUser={me}
          onSignOut={signOutAction}
        />
      </Suspense>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <SidebarTrigger />
        </div>
        <main className="p-6 flex-grow">{children}</main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
