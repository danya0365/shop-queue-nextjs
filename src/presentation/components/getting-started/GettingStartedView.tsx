'use client';

import { GettingStartedViewModel } from '@/src/presentation/presenters/getting-started/GettingStartedPresenter';
import { useGettingStartedPresenter } from '@/src/presentation/presenters/getting-started/useGettingStartedPresenter';
import { useAuthStore } from '@/src/presentation/stores/auth-store';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface GettingStartedViewProps {
  viewModel: GettingStartedViewModel;
}

export function GettingStartedView({ viewModel }: GettingStartedViewProps) {
  const [state, actions] = useGettingStartedPresenter();
  const { authAccount } = useAuthStore();

  // Auto-check step 1 if user is logged in
  useEffect(() => {
    if (authAccount && !state.completedSteps.includes(1)) {
      actions.markStepComplete(1);
    }
  }, [authAccount, state.completedSteps, actions]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            คู่มือการใช้งาน
            <br />
            <span className="text-primary-light">Shop Queue</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            เรียนรู้วิธีการใช้งานระบบจัดการคิวร้านค้าอย่างละเอียด พร้อมคำแนะนำทีละขั้นตอน
          </p>
          
          {/* Quick Start Toggle */}
          <div className="flex justify-center mb-8">
            <button
              onClick={actions.toggleQuickStart}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                state.showQuickStart
                  ? 'bg-white text-primary'
                  : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary'
              }`}
            >
              {state.showQuickStart ? '📖 ดูคู่มือแบบละเอียด' : '⚡ ดูแบบเริ่มต้นด่วน'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Quick Start Section */}
        {state.showQuickStart && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                ⚡ เริ่มต้นใช้งานด่วน
              </h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                ขั้นตอนพื้นฐาน 4 ขั้นตอนเพื่อเริ่มใช้งานระบบได้ทันที
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {viewModel.quickStart.map((step, index) => (
                <div
                  key={step.id}
                  className={`bg-card rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                    state.completedSteps.includes(step.id)
                      ? 'border-success bg-success/5'
                      : 'border-border hover:border-primary'
                  }`}
                  onClick={() => 
                    state.completedSteps.includes(step.id)
                      ? actions.markStepIncomplete(step.id)
                      : actions.markStepComplete(step.id)
                  }
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary">
                        ขั้นตอน {index + 1}
                      </span>
                      {state.completedSteps.includes(step.id) && (
                        <span className="text-success">✅</span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted text-sm mb-4">{step.description}</p>
                    
                    <div className="text-left">
                      <ul className="text-xs text-muted space-y-1">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-primary mr-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="bg-card rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  ความคืบหน้า
                </span>
                <span className="text-sm text-muted">
                  {state.completedSteps.filter(id => id <= 4).length}/4 ขั้นตอน
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <div
                  className="bg-primary-gradient h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(state.completedSteps.filter(id => id <= 4).length / 4) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Detailed Tutorial Sections */}
        {!state.showQuickStart && (
          <div>
            {/* Section Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-card rounded-lg p-2 flex space-x-2">
                {viewModel.sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => actions.setCurrentSection(index)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      state.currentSection === index
                        ? 'bg-primary text-white'
                        : 'text-muted hover:text-foreground hover:bg-background'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Section */}
            {viewModel.sections[state.currentSection] && (
              <div className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    {viewModel.sections[state.currentSection].title}
                  </h2>
                  <p className="text-xl text-muted max-w-3xl mx-auto">
                    {viewModel.sections[state.currentSection].description}
                  </p>
                </div>

                <div className="space-y-8">
                  {viewModel.sections[state.currentSection].steps.map((step) => (
                    <div
                      key={step.id}
                      className={`bg-card rounded-xl p-8 border-2 transition-all duration-300 ${
                        state.completedSteps.includes(step.id)
                          ? 'border-success bg-success/5'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-start space-x-6">
                        <div className="text-5xl flex-shrink-0">{step.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-foreground">
                              {step.title}
                            </h3>
                            <button
                              onClick={() => 
                                state.completedSteps.includes(step.id)
                                  ? actions.markStepIncomplete(step.id)
                                  : actions.markStepComplete(step.id)
                              }
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                state.completedSteps.includes(step.id)
                                  ? 'bg-success text-white'
                                  : 'bg-primary text-white hover:bg-primary-dark'
                              }`}
                            >
                              {state.completedSteps.includes(step.id) ? '✅ เสร็จแล้ว' : '✓ ทำเสร็จ'}
                            </button>
                          </div>
                          
                          <p className="text-lg text-muted mb-6">{step.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {step.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-white text-sm font-bold">{idx + 1}</span>
                                </div>
                                <span className="text-foreground">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              💡 เคล็ดลับการใช้งาน
            </h2>
            <p className="text-xl text-muted">
              คำแนะนำที่จะช่วยให้คุณใช้งานระบบได้อย่างมีประสิทธิภาพ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {viewModel.tips.map((tip, index) => (
              <div key={index} className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-warning">💡</span>
                  </div>
                  <p className="text-foreground">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary-gradient rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มต้นใช้งานแล้วใช่ไหม?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            สมัครสมาชิกวันนี้และเริ่มจัดการคิวร้านค้าของคุณอย่างมืออาชีพ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!authAccount ? (
              <>
                <Link
                  href="/auth/register"
                  className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  สมัครสมาชิกฟรี
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
                >
                  ติดต่อสอบถาม
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  ไปที่แดชบอร์ด
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-colors"
                >
                  ติดต่อสอบถาม
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
