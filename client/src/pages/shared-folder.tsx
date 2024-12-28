import React from 'react'
import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import AppBreadcrumb from '@/components/app-breadcrumb'
import { Outlet } from 'react-router-dom'

function SharedFolder() {
  return (
    <SidebarProvider>
    <AppSidebar />

    <main className="flex flex-col w-full bg-secondary p-2 gap-4">
      <div className="flex space-x-2 items-center">
        <SidebarTrigger/>
        <Separator orientation="vertical" className="h-4" />
        <AppBreadcrumb />
      </div>
      <Outlet />
    </main>
  </SidebarProvider>
  )
}

export default SharedFolder