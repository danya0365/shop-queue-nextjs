"use client";

import type { LandingViewModel } from "@/src/presentation/presenters/LandingPresenter";

interface LandingViewProps {
  viewModel: LandingViewModel;
}

export function LandingView({ viewModel }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-overlay opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {viewModel.title}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              {viewModel.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-primary hover:bg-gray-50 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                เริ่มใช้งานฟรี
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-4 px-8 rounded-full transition-all duration-300">
                ดูตัวอย่าง
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {viewModel.stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              ฟีเจอร์ที่ครบครัน
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              ระบบจัดการคิวที่ตอบโจทย์ทุกความต้องการของร้านค้าและลูกค้า
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {viewModel.features.map((feature) => (
              <div key={feature.id} className="card-bg card-border card-shadow rounded-2xl p-8 text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Queue Status Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl text-black font-bold mb-4">
              ติดตามสถานะคิวแบบเรียลไทม์
            </h2>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              ดูตัวอย่างการทำงานของระบบจัดการคิว
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="card-bg card-border card-shadow rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Queue Status */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6">สถานะคิวปัจจุบัน</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-serving/10 border border-serving/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-serving rounded-full"></div>
                        <span className="font-medium">คิวที่ A001</span>
                      </div>
                      <span className="text-serving font-semibold">กำลังให้บริการ</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-waiting/10 border border-waiting/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-waiting rounded-full"></div>
                        <span className="font-medium">คิวที่ A002</span>
                      </div>
                      <span className="text-waiting font-semibold">รอคิว (ถัดไป)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-waiting/10 border border-waiting/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-waiting rounded-full"></div>
                        <span className="font-medium">คิวที่ A003</span>
                      </div>
                      <span className="text-waiting font-semibold">รอคิว (เหลือ 2 คิว)</span>
                    </div>
                  </div>
                </div>

                {/* Queue Stats */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6">สถิติวันนี้</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <span className="text-muted">คิวทั้งหมด</span>
                      <span className="text-2xl font-bold text-primary">24</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                      <span className="text-muted">เสร็จสิ้นแล้ว</span>
                      <span className="text-2xl font-bold text-secondary">18</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-waiting/5 border border-waiting/10">
                      <span className="text-muted">เวลารอเฉลี่ย</span>
                      <span className="text-2xl font-bold text-waiting">15 นาที</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-queue-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            พร้อมเริ่มต้นใช้งานแล้วหรือยัง?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            เริ่มใช้งาน Shop Queue วันนี้ และเปลี่ยนวิธีการจัดการคิวของร้านคุณให้ดีขึ้น
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-primary hover:bg-gray-50 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              สมัครใช้งานฟรี
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold py-4 px-8 rounded-full transition-all duration-300">
              ติดต่อเรา
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
