"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import {
  getNotificationsAction,
  markAsReadAction,
  markAllAsReadAction,
  archiveNotificationAction,
} from "../actions";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  status: string;
  createdAt: string | Date;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.status === "UNREAD").length;

  const loadNotifications = () => {
    startTransition(async () => {
      const res = await getNotificationsAction();
      if (res.success && res.data) {
        setNotifications(res.data as any);
      }
    });
  };

  useEffect(() => {
    loadNotifications();

    // Auto-refresh interval 30s
    const timer = setInterval(loadNotifications, 30000);

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markAsReadAction(id);
      loadNotifications();
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllAsReadAction();
      loadNotifications();
    });
  };

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      await archiveNotificationAction(id);
      loadNotifications();
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="btn-notification-bell"
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadNotifications();
        }}
        className="relative p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted transition-colors focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5.5 h-5.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 max-w-[90vw] bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/80 flex items-center justify-between">
            <span className="font-bold text-sm text-foreground">Notifikasi</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-xs font-semibold text-primary hover:opacity-85 transition disabled:opacity-50"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Tidak ada notifikasi baru.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => n.status === "UNREAD" && handleMarkRead(n.id)}
                  className={`p-3.5 text-left transition-colors cursor-pointer relative group flex gap-3 ${
                    n.status === "UNREAD" ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40"
                  }`}
                >
                  {/* Status Indicator */}
                  {n.status === "UNREAD" && (
                    <span className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  <div className="flex-1 min-w-0 pl-1">
                    <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed break-words">
                      {n.message}
                    </p>
                    <span className="text-[9px] text-muted-foreground/80 mt-1 block">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(n.createdAt))}
                    </span>
                  </div>
                  {/* Archive Button */}
                  <button
                    type="button"
                    onClick={(e) => handleArchive(n.id, e)}
                    disabled={isPending}
                    title="Arsipkan"
                    className="self-center p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted opacity-0 group-hover:opacity-100 transition focus:opacity-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
