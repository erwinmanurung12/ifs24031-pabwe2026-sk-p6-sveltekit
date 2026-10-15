<script lang="ts">
  import { GraduationCap, Users, User } from "lucide-svelte";
  import { link } from "../../../helpers/navHelper";

  let { path = "/", open = false } = $props();

  const items = [
    { href: "/", label: "Semua Kursus", icon: GraduationCap, match: (p) => p === "/" || p.startsWith("/courses") },
    { href: "/users", label: "Pengguna", icon: Users, match: (p) => p.startsWith("/users") },
    { href: "/profile", label: "Profil", icon: User, match: (p) => p.startsWith("/profile") },
  ];
</script>

<nav
  id="sidebar-menu"
  aria-label="Menu utama"
  class={`${open ? "block" : "hidden"} border-b border-slate-200 bg-white p-3 lg:block lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r`}
>
  <ul class="space-y-1">
    {#each items as item (item.href)}
      {@const active = item.match(path)}
      <li>
        <a
          href={item.href}
          use:link
          aria-current={active ? "page" : undefined}
          class={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold ${active ? "bg-blue-50 text-blue-800" : "text-slate-800 hover:bg-slate-100"}`}
        >
          <item.icon size={20} aria-hidden="true" />
          <span>{item.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>
