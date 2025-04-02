"use client";

import React, { Fragment, createContext, useContext, useState } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// 通知の種類
export type NotificationType = "success" | "error" | "warning" | "info";

// 通知の型定義
export interface INotification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  position?: NotificationPosition;
}

// 通知の位置
export type NotificationPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

// 通知コンテキストの型定義
interface NotificationContextType {
  notifications: INotification[];
  showNotification: (notification: Omit<INotification, "id">) => void;
  hideNotification: (id: string) => void;
}

// デフォルト値
const defaultPosition: NotificationPosition = "top-right";
const defaultDuration = 5000; // 5秒

// 通知コンテキストの作成
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// 通知システムのプロバイダー
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  // 通知を表示する
  const showNotification = (notification: Omit<INotification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: INotification = {
      id,
      ...notification,
      duration: notification.duration || defaultDuration,
      position: notification.position || defaultPosition,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // 自動的に通知を非表示にする（duration=0の場合は手動で閉じるまで表示）
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, newNotification.duration);
    }
  };

  // 通知を非表示にする
  const hideNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// 通知コンテキストを使用するためのフック
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}

// 通知コンテナ
function NotificationContainer() {
  const { notifications, hideNotification } = useNotification();

  // 位置ごとに通知をグループ化
  const groupedNotifications = notifications.reduce<
    Record<NotificationPosition, INotification[]>
  >(
    (acc, notification) => {
      const position = notification.position || defaultPosition;
      acc[position] = [...(acc[position] || []), notification];
      return acc;
    },
    {
      "top-right": [],
      "top-left": [],
      "bottom-right": [],
      "bottom-left": [],
      "top-center": [],
      "bottom-center": [],
    }
  );

  // 位置に対応するスタイルを取得
  const getPositionStyles = (position: NotificationPosition): string => {
    switch (position) {
      case "top-right":
        return "top-4 right-4 flex flex-col items-end";
      case "top-left":
        return "top-4 left-4 flex flex-col items-start";
      case "bottom-right":
        return "bottom-4 right-4 flex flex-col items-end";
      case "bottom-left":
        return "bottom-4 left-4 flex flex-col items-start";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2 flex flex-col items-center";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center";
      default:
        return "top-4 right-4 flex flex-col items-end";
    }
  };

  // 各位置にある通知を配置
  return (
    <>
      {Object.entries(groupedNotifications).map(([position, notifications]) => (
        <div
          key={position}
          className={`fixed z-50 space-y-2 ${getPositionStyles(
            position as NotificationPosition
          )}`}
        >
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              onClose={() => hideNotification(notification.id)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

// 個々の通知
function Notification({
  notification,
  onClose,
}: {
  notification: INotification;
  onClose: () => void;
}) {
  // 通知タイプに対応するアイコンとスタイルを取得
  const getTypeStyles = (
    type: NotificationType
  ): { icon: React.ReactNode; styles: string } => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          styles: "bg-green-50 text-green-800 border-green-300",
        };
      case "error":
        return {
          icon: <XCircle className="h-5 w-5" />,
          styles: "bg-red-50 text-red-800 border-red-300",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          styles: "bg-yellow-50 text-yellow-800 border-yellow-300",
        };
      case "info":
        return {
          icon: <Info className="h-5 w-5" />,
          styles: "bg-blue-50 text-blue-800 border-blue-300",
        };
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          styles: "bg-gray-50 text-gray-800 border-gray-300",
        };
    }
  };

  const { icon, styles } = getTypeStyles(notification.type);

  return (
    <Transition
      as={Fragment}
      show={true}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={`max-w-sm w-full shadow-lg rounded-lg border p-4 pointer-events-auto ${styles}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3 w-0 flex-1">
            {notification.title && (
              <p className="font-medium">{notification.title}</p>
            )}
            <p className="mt-1 text-sm">{notification.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">閉じる</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
}

// 成功通知を表示する便利関数
export function SuccessMessage({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div className={`rounded-md bg-green-50 p-4 ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
      </div>
    </div>
  );
}

// エラーメッセージを表示する便利関数
export function ErrorMessage({
  message,
  className = "",
  onRetry,
}: {
  message: string;
  className?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-800 underline"
            >
              再試行
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
