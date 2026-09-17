"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("jb-theme");
    const nextDark = saved ? saved === "dark" : true;
    document.documentElement.classList.toggle("dark", nextDark);
    setDark(nextDark);
  }, []);

  function toggle() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem("jb-theme", nextDark ? "dark" : "light");
  }

  return (
    <Button type="button" variant="ghost" size="icon" onClick={toggle} aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
