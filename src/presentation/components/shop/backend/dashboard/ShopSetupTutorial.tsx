"use client";

import Link from "next/link";
import { useShopSetupTutorialStore } from "@/src/presentation/stores/shop-setup-tutorial-store";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "completed" | "pending" | "optional";
  link: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
}

interface ShopSetupTutorialProps {
  shopId: string;
  setupProgress: {
    hasBasicInfo: boolean;
    hasSettings: boolean;
    hasOpeningHours: boolean;
    hasServices: boolean;
    hasEmployees: boolean;
    hasDepartments: boolean;
    servicesCount: number;
    employeesCount: number;
    departmentsCount: number;
  };
}

export function ShopSetupTutorial({
  shopId,
  setupProgress,
}: ShopSetupTutorialProps) {
  const isCollapsed = useShopSetupTutorialStore((state) => {
    return state.collapsedShops[shopId] ?? false;
  });
  const setCollapsed = useShopSetupTutorialStore((state) => state.setCollapsed);
  const isExpanded = !isCollapsed;

  // Calculate setup steps based on current progress
  const setupSteps: SetupStep[] = [
    {
      id: "basic-info",
      title: "ข้อมูลพื้นฐานร้าน",
      description: "ตั้งค่าชื่อร้าน ที่อยู่ เบอร์โทร และข้อมูลติดต่อ",
      icon: "🏪",
      status: setupProgress.hasBasicInfo ? "completed" : "pending",
      link: `/shop/${shopId}/backend/settings`,
      priority: "high",
      estimatedTime: "5 นาที",
    },
    {
      id: "shop-settings",
      title: "การตั้งค่าร้าน",
      description: "กำหนดวิธีการชำระเงิน จำนวนคิวสูงสุด และกฎการจองคิว",
      icon: "⚙️",
      status: setupProgress.hasSettings ? "completed" : "pending",
      link: `/shop/${shopId}/backend/settings`,
      priority: "high",
      estimatedTime: "10 นาที",
    },
    {
      id: "opening-hours",
      title: "เวลาทำการ",
      description: "กำหนดเวลาเปิด-ปิดร้าน และวันหยุดประจำสัปดาห์",
      icon: "🕐",
      status: setupProgress.hasOpeningHours ? "completed" : "pending",
      link: `/shop/${shopId}/backend/opening-hours`,
      priority: "high",
      estimatedTime: "5 นาที",
    },
    {
      id: "services",
      title: "บริการ",
      description: `เพิ่มบริการที่ลูกค้าสามารถจองได้ (ปัจจุบัน: ${setupProgress.servicesCount} บริการ)`,
      icon: "🔧",
      status: setupProgress.hasServices ? "completed" : "pending",
      link: `/shop/${shopId}/backend/services`,
      priority: "high",
      estimatedTime: "15 นาที",
    },
    {
      id: "employees",
      title: "พนักงาน",
      description: `เพิ่มพนักงานที่จะให้บริการลูกค้า (ปัจจุบัน: ${setupProgress.employeesCount} คน)`,
      icon: "👥",
      status: setupProgress.hasEmployees ? "completed" : "pending",
      link: `/shop/${shopId}/backend/employees`,
      priority: "high",
      estimatedTime: "10 นาที",
    },
    {
      id: "departments",
      title: "แผนก (ไม่บังคับ)",
      description: `จัดระเบียบพนักงานตามแผนกงาน (ปัจจุบัน: ${setupProgress.departmentsCount} แผนก)`,
      icon: "🏢",
      status: setupProgress.hasDepartments ? "completed" : "optional",
      link: `/shop/${shopId}/backend/departments`,
      priority: "low",
      estimatedTime: "5 นาที",
    },
  ];

  // Calculate completion percentage
  const requiredSteps = setupSteps.filter((step) => step.priority === "high");
  const completedRequiredSteps = requiredSteps.filter(
    (step) => step.status === "completed"
  );
  const completionPercentage = Math.round(
    (completedRequiredSteps.length / requiredSteps.length) * 100
  );

  // Check if shop is ready for queues
  const isQueueReady = completedRequiredSteps.length === requiredSteps.length;

  // Get next step to complete
  const nextStep = setupSteps.find(
    (step) => step.status === "pending" && step.priority === "high"
  );

  if (!isExpanded) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {isQueueReady ? (
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xl">
                    ✅
                  </span>
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">
                    🚀
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {isQueueReady ? "ร้านพร้อมรับคิวแล้ว!" : "การตั้งค่าร้าน"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isQueueReady
                  ? "ร้านของคุณพร้อมให้บริการลูกค้าแล้ว"
                  : `เสร็จสิ้น ${completionPercentage}% (${completedRequiredSteps.length}/${requiredSteps.length} ขั้นตอน)`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(shopId, false)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
          >
            ดูรายละเอียด →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
      {/* Header */}
      <div className="p-6 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {isQueueReady ? (
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-2xl">
                    ✅
                  </span>
                </div>
              ) : (
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-2xl">
                    🚀
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {isQueueReady
                  ? "🎉 ร้านพร้อมรับคิวแล้ว!"
                  : "การตั้งค่าร้านเพื่อรับคิว"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isQueueReady
                  ? "ร้านของคุณพร้อมให้บริการลูกค้าแล้ว คุณสามารถเริ่มรับคิวได้เลย!"
                  : "ทำตามขั้นตอนเหล่านี้เพื่อให้ร้านพร้อมรับคิวจากลูกค้า"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(shopId, true)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        {!isQueueReady && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>ความคืบหน้า</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {isQueueReady ? (
          /* Success State */
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎊</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ยินดีด้วย! ร้านพร้อมรับคิวแล้ว
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ร้านของคุณได้ตั้งค่าครบถ้วนแล้ว ลูกค้าสามารถเข้าคิวและใช้บริการได้
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href={`/shop/${shopId}/queue`}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🎯 เริ่มรับคิว
              </Link>
              <Link
                href={`/shop/${shopId}/backend/queue`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                📋 จัดการคิว
              </Link>
            </div>
          </div>
        ) : (
          /* Setup Steps */
          <div className="space-y-4">
            {/* Next Step Highlight */}
            {nextStep && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{nextStep.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      ขั้นตอนถัดไป: {nextStep.title}
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {nextStep.description}
                    </p>
                  </div>
                  <Link
                    href={nextStep.link}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    เริ่มตั้งค่า
                  </Link>
                </div>
              </div>
            )}

            {/* All Steps */}
            <div className="grid gap-4">
              {setupSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                    step.status === "completed"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : step.status === "pending"
                      ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step.status === "completed"
                          ? "bg-green-500 text-white"
                          : step.status === "pending"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {step.status === "completed" ? "✓" : index + 1}
                    </div>
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {step.title}
                      </h4>
                      {step.priority === "high" && (
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium">
                          จำเป็น
                        </span>
                      )}
                      {step.status === "optional" && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full font-medium">
                          ไม่บังคับ
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {step.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>⏱️ {step.estimatedTime}</span>
                      {step.status === "completed" && (
                        <span className="text-green-600 dark:text-green-400">
                          ✅ เสร็จสิ้น
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {step.status === "completed" ? (
                      <Link
                        href={step.link}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium text-sm"
                      >
                        แก้ไข
                      </Link>
                    ) : (
                      <Link
                        href={step.link}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          step.status === "pending"
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {step.status === "pending" ? "ตั้งค่า" : "ตั้งค่า"}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Help Section */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-xl">💡</span>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    ต้องการความช่วยเหลือ?
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    หากคุณต้องการความช่วยเหลือในการตั้งค่าร้าน
                    สามารถติดต่อทีมสนับสนุนได้
                  </p>
                  <div className="flex space-x-3">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                      📞 ติดต่อสนับสนุน
                    </button>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                      📖 ดูคู่มือ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
