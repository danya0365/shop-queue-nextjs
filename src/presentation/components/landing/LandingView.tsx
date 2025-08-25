'use client';

import type { Feature, LandingViewModel, QueueItem } from '@/src/presentation/presenters/landing/LandingPresenter';
import { useLandingPresenter } from '@/src/presentation/presenters/landing/useLandingPresenter';
import Link from 'next/link';
import { useState } from 'react';

interface LandingViewProps {
  viewModel: LandingViewModel;
}

export function LandingView({ viewModel }: LandingViewProps) {
  const { features, stats, benefits, queueDemo } = viewModel;
  const [state, actions] = useLandingPresenter();
  const [email, setEmail] = useState('');

  const getStatusColor = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-waiting text-white';
      case 'confirmed':
        return 'bg-info text-white';
      case 'served':
        return 'bg-serving text-white';
      case 'canceled':
        return 'bg-cancelled text-white';
      default:
        return 'bg-muted text-white';
    }
  };

  const getStatusText = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting':
        return 'รอดำเนินการ';
      case 'confirmed':
        return 'ยืนยันแล้ว';
      case 'served':
        return 'ให้บริการแล้ว';
      case 'canceled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  const ownerFeatures = features.filter(f => f.category === 'owner');
  const staffFeatures = features.filter(f => f.category === 'staff');
  const customerFeatures = features.filter(f => f.category === 'customer');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-elegant text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-overlay"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            ระบบจัดการคิว
            <br />
            <span className="text-warning">อัจฉริยะ</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            ช่วยให้ร้านค้าสามารถจัดการลูกค้าได้อย่างมีประสิทธิภาพ
            ลดความแออัด และเพิ่มความพึงพอใจของลูกค้า
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-surface text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-muted-light transition-colors shadow-lg"
            >
              เริ่มใช้งานฟรี
            </Link>
            <Link
              href="#demo"
              className="border-2 border-surface text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-surface hover:text-primary transition-colors"
            >
              ดูตัวอย่าง
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-overlay-light rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-overlay-light rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-warning/20 rounded-full animate-bounce"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              ฟีเจอร์ครบครัน
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              ระบบที่ออกแบบมาเพื่อตอบสนองความต้องการของทุกฝ่าย
            </p>
          </div>

          {/* Owner Features */}
          <div className="mb-16">
            <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8 text-primary">
              🏪 สำหรับเจ้าของร้าน
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ownerFeatures.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>

          {/* Staff Features */}
          <div className="mb-16">
            <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8 text-secondary">
              🧑‍💼 สำหรับพนักงาน
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {staffFeatures.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>

          {/* Customer Features */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8 text-info">
              👥 สำหรับลูกค้า
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {customerFeatures.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Queue Demo Section */}
      <section id="demo" className="py-20 bg-muted-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              ดูการทำงานแบบเรียลไทม์
            </h2>
            <p className="text-xl text-muted">
              ตัวอย่างระบบคิวที่ทำงานจริง
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-surface rounded-2xl shadow-xl p-8">
              {/* Demo Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {queueDemo.stats.totalToday}
                  </div>
                  <div className="text-sm text-muted">คิววันนี้</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {queueDemo.stats.averageWaitTime}
                  </div>
                  <div className="text-sm text-muted">เวลารอเฉลี่ย</div>
                </div>
                <div className="text-center p-4 bg-info/10 rounded-lg">
                  <div className="text-2xl font-bold text-info">
                    {queueDemo.stats.currentlyServing}
                  </div>
                  <div className="text-sm text-muted">กำลังให้บริการ</div>
                </div>
              </div>

              {/* Queue List */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">คิวปัจจุบัน</h3>
                {queueDemo.currentQueue.map((queue) => (
                  <div
                    key={queue.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-foreground">
                          {queue.number}
                        </span>
                        {queue.priority && (
                          <span className="bg-priority text-white px-2 py-1 rounded text-xs font-semibold">
                            ด่วน
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {queue.customerName}
                        </div>
                        <div className="text-sm text-muted">
                          {queue.estimatedTime}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(queue.status)}`}>
                      {getStatusText(queue.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              ประโยชน์ที่ได้รับ
            </h2>
            <p className="text-xl text-muted">
              เหตุผลที่ควรเลือกใช้ Shop Queue
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="bg-surface p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-border"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            เริ่มใช้งาน Shop Queue วันนี้ และสัมผัสประสบการณ์การจัดการคิวที่ไม่เหมือนใคร
          </p>

          {/* Newsletter Subscription */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลเพื่อรับข่าวสาร"
                className="flex-1 px-4 py-3 rounded-lg text-foreground bg-input border border-input-border focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={state.isLoading || state.isSubscribed}
              />
              <button
                onClick={() => actions.subscribeNewsletter({ email })}
                disabled={state.isLoading || state.isSubscribed}
                className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-50"
              >
                {state.isLoading ? 'กำลังส่ง...' : state.isSubscribed ? 'สำเร็จ!' : 'สมัคร'}
              </button>
            </div>
            {state.error && (
              <p className="text-error text-sm mt-2">{state.error}</p>
            )}
            {state.isSubscribed && (
              <p className="text-success text-sm mt-2">ขอบคุณที่สมัครรับข่าวสาร!</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-surface text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-muted-light transition-colors shadow-lg"
            >
              สมัครสมาชิกฟรี
            </Link>
            <Link
              href="/contact"
              className="border-2 border-surface text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-surface hover:text-primary transition-colors"
            >
              ติดต่อเรา
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="bg-surface p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-border">
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {feature.title}
      </h3>
      <p className="text-muted leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}
