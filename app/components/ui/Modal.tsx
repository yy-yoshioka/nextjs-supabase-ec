"use client";

import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  hideCloseIcon?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  closeOnClickOutside = true,
  showCloseButton = false,
  hideCloseIcon = false,
}: ModalProps) {
  const initialFocusRef = useRef(null);

  // モーダルの最大幅のクラスを選択
  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    full: "sm:max-w-full sm:w-[calc(100%-2rem)]",
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        initialFocus={initialFocusRef}
        onClose={closeOnClickOutside ? onClose : () => {}}
      >
        {/* オーバーレイ */}
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* モーダルが中央に配置されるためのハック */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* モーダルコンテンツ */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:align-middle ${maxWidthClasses[maxWidth]}`}
            >
              {/* モーダルヘッダー（タイトルがある場合） */}
              {(title || !hideCloseIcon) && (
                <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
                  <div className="flex items-center justify-between">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {!hideCloseIcon && (
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={onClose}
                        aria-label="閉じる"
                      >
                        <span className="sr-only">閉じる</span>
                        <X className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {description && (
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                  )}
                </div>
              )}

              {/* モーダル本文 */}
              <div className="px-4 py-4 sm:px-6">{children}</div>

              {/* モーダルフッター（フッターがある場合、または閉じるボタンが表示される場合） */}
              {(footer || showCloseButton) && (
                <div className="border-t border-gray-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sm:gap-2">
                  {footer}
                  {showCloseButton && (
                    <Button
                      variant="secondary"
                      onClick={onClose}
                      type="button"
                      ref={initialFocusRef}
                    >
                      閉じる
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
