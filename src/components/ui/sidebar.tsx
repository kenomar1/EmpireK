"use client";

import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { ScrollArea } from "./scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Separator } from "./separator";
import {
  Menu,
  Home,
  Users,
  BarChart,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "Dashboard" },
  { icon: Users, label: "Users" },
  { icon: BarChart, label: "Analytics" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex h-16 items-center justify-center border-b px-6">
        <h1 className="text-2xl font-bold">Mutaraf</h1>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)} // يقفل الـ sidebar لما تختار أي حاجة
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
          <a>hi</a>
        </nav>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Ahmed</p>
            <p className="text-xs text-muted-foreground">ahmed@example.com</p>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* الزر اللي بيفتح الـ Sidebar – ثابت في الشاشة */}
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-50 bg-background/80 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      {/* الـ Sidebar نفسه */}
      <SheetContent side="left" className="w-64 p-0 border-r-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
