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
      <section className="relative bg-hero-orange-sunset text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 border border-white/30">
                <span className="w-2 h-2 bg-hero-status-active rounded-full mr-2 animate-pulse"></span>
                ระบบจัดการคิวอัจฉริยะ
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                <span className="block">จัดการคิว</span>
                <span className="block bg-gradient-to-r from-white to-hero-text-light bg-clip-text text-transparent">
                  อย่างมืออาชีพ
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-hero-text-light mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                ระบบจัดการคิวที่ทันสมัย ช่วยลดเวลารอ เพิ่มประสิทธิภาพ 
                และสร้างประสบการณ์ที่ดีให้กับลูกค้าของคุณ
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  href="/auth/register"
                  className="group bg-white text-hero-text-accent px-8 py-4 rounded-xl font-semibold text-lg hover:bg-hero-button-bg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  เริ่มใช้งานฟรี
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#demo"
                  className="group border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
                >
                  ดูการทำงาน
                  <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-hero-text-light">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-hero-status-active mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">ใช้งานฟรี 30 วัน</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-hero-status-active mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">ไม่ต้องติดตั้ง</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-hero-status-active mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">รองรับทุกอุปกรณ์</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Visual Demo */}
            <div className="relative">
              {/* Main Demo Card */}
              <div className="bg-hero-card-bg backdrop-blur-lg rounded-2xl p-6 border border-hero-card-border shadow-2xl hero-glow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-hero-card-text">คิวปัจจุบัน</h3>
                  <div className="flex items-center text-hero-status-active">
                    <div className="w-2 h-2 bg-hero-status-active rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm">ออนไลน์</span>
                  </div>
                </div>
                
                {/* Queue Items */}
                <div className="space-y-3">
                  {[
                    { number: 'A001', name: 'คุณสมชาย', status: 'กำลังให้บริการ', color: 'bg-hero-status-active' },
                    { number: 'A002', name: 'คุณสมหญิง', status: 'รอ 5 นาที', color: 'bg-hero-status-waiting' },
                    { number: 'A003', name: 'คุณสมศักดิ์', status: 'รอ 12 นาที', color: 'bg-hero-status-pending' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-hero-card-bg rounded-lg border border-hero-card-border">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-hero-card-bg rounded-lg flex items-center justify-center font-bold text-hero-card-text mr-3 border border-hero-card-border">
                          {item.number}
                        </div>
                        <div>
                          <div className="text-hero-card-text font-medium">{item.name}</div>
                          <div className="text-hero-card-text-muted text-sm">{item.status}</div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                    </div>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-hero-card-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-hero-card-text">24</div>
                    <div className="text-xs text-hero-card-text-muted">วันนี้</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-hero-card-text">8</div>
                    <div className="text-xs text-hero-card-text-muted">นาที</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-hero-card-text">3</div>
                    <div className="text-xs text-hero-card-text-muted">รอคิว</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20 animate-bounce">
                <div className="flex items-center text-white">
                  <svg className="w-4 h-4 mr-2 text-hero-status-active" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">เรียลไทม์</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20 animate-pulse">
                <div className="flex items-center text-white">
                  <svg className="w-4 h-4 mr-2 text-hero-accent-soft" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">อัตโนมัติ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="rgba(255,255,255,0.1)" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
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
