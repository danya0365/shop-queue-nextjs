"use client";

import { ShopAboutViewModel } from "@/src/presentation/presenters/shop/about/ShopAboutPresenter";
import { useShopAboutPresenter } from "@/src/presentation/presenters/shop/about/useShopAboutPresenter";
import {
  Award,
  Building,
  Calendar,
  Eye,
  Globe,
  MapPin,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

interface ShopAboutViewProps {
  initialViewModel?: ShopAboutViewModel | null;
}

export function ShopAboutView({ initialViewModel }: ShopAboutViewProps) {
  const [state, actions] = useShopAboutPresenter(initialViewModel);
  const { viewModel, loading, error } = state;

  // Show loading state
  if (loading && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            กำลังโหลดข้อมูลเกี่ยวกับเรา...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={actions.refreshData}
            className="marketplace-button-primary px-4 py-2 rounded-lg transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!viewModel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ไม่พบข้อมูล
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ไม่สามารถโหลดข้อมูลเกี่ยวกับเราได้
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold marketplace-text-primary mb-6">
          เกี่ยวกับ {viewModel.companyInfo.name}
        </h1>
        <p className="text-xl marketplace-text-secondary max-w-4xl mx-auto leading-relaxed">
          {viewModel.companyInfo.description}
        </p>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-indigo-50 dark:from-orange-900/20 dark:to-indigo-900/20 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold marketplace-text-primary mb-4">
            ตัวเลขที่น่าประทับใจ
          </h2>
          <p className="marketplace-text-secondary">
            ความสำเร็จที่เราภูมิใจร่วมกับลูกค้า
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="marketplace-stat-icon-bg bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-orange-600 dark:text-orange-300" />
            </div>
            <p className="text-3xl font-bold marketplace-text-primary mb-2">
              {viewModel.stats.totalShops.toLocaleString()}+
            </p>
            <p className="marketplace-text-secondary">ร้านค้าที่ใช้บริการ</p>
          </div>

          <div className="text-center">
            <div className="marketplace-stat-icon-bg bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <p className="text-3xl font-bold marketplace-text-primary mb-2">
              {viewModel.stats.totalCustomers.toLocaleString()}+
            </p>
            <p className="marketplace-text-secondary">ลูกค้าที่ใช้บริการ</p>
          </div>

          <div className="text-center">
            <div className="marketplace-stat-icon-bg bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
            <p className="text-3xl font-bold marketplace-text-primary mb-2">
              {viewModel.stats.totalQueues.toLocaleString()}+
            </p>
            <p className="marketplace-text-secondary">คิวที่จัดการ</p>
          </div>

          <div className="text-center">
            <div className="marketplace-stat-icon-bg bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-300" />
            </div>
            <p className="text-3xl font-bold marketplace-text-primary mb-2">
              {viewModel.stats.yearsOfService}+
            </p>
            <p className="marketplace-text-secondary">ปีของการให้บริการ</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="marketplace-card p-8">
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 text-orange-600 mr-3" />
            <h3 className="text-2xl font-bold marketplace-text-primary">
              พันธกิจ
            </h3>
          </div>
          <p className="marketplace-text-secondary leading-relaxed">
            {viewModel.companyInfo.mission}
          </p>
        </div>

        <div className="marketplace-card p-8">
          <div className="flex items-center mb-6">
            <Eye className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-2xl font-bold marketplace-text-primary">
              วิสัยทัศน์
            </h3>
          </div>
          <p className="marketplace-text-secondary leading-relaxed">
            {viewModel.companyInfo.vision}
          </p>
        </div>
      </section>

      {/* Company Values */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold marketplace-text-primary mb-4">
            ค่านิยมองค์กร
          </h2>
          <p className="marketplace-text-secondary">
            หลักการที่เราใช้ในการทำงานและให้บริการ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {viewModel.companyValues.map((value) => (
            <div
              key={value.id}
              className="marketplace-card p-6 text-center marketplace-card-hover"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-lg font-semibold marketplace-text-primary mb-3">
                {value.title}
              </h3>
              <p className="marketplace-text-secondary text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      {viewModel.teamMembers.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold marketplace-text-primary mb-4">
              ทีมงานของเรา
            </h2>
            <p className="marketplace-text-secondary">
              บุคลากรที่มีความเชี่ยวชาญและประสบการณ์
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {viewModel.teamMembers.map((member) => (
              <div
                key={member.id}
                className="marketplace-card p-6 text-center marketplace-card-hover"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12 text-orange-600 dark:text-orange-300" />
                </div>
                <h3 className="text-lg font-semibold marketplace-text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-orange-600 dark:text-orange-400 font-medium mb-3">
                  {member.position}
                </p>
                <p className="marketplace-text-secondary text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold marketplace-text-primary mb-4">
            เส้นทางการเติบโต
          </h2>
          <p className="marketplace-text-secondary">
            ประวัติความเป็นมาและการพัฒนาของเรา
          </p>
        </div>

        <div className="space-y-8">
          {viewModel.timeline.map((item, index) => (
            <div key={index} className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="marketplace-card p-6 flex-1">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-orange-600 font-semibold">
                    {item.year}
                  </span>
                </div>
                <h3 className="text-lg font-semibold marketplace-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="marketplace-text-secondary">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      {viewModel.achievements.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold marketplace-text-primary mb-4">
              รางวัลและความสำเร็จ
            </h2>
            <p className="marketplace-text-secondary">
              การยอมรับและความสำเร็จที่เราได้รับ
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {viewModel.achievements.map((achievement, index) => (
              <div
                key={index}
                className="marketplace-card p-6 flex items-center space-x-4"
              >
                <Award className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                <p className="marketplace-text-secondary">{achievement}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Company Info */}
      <section className="marketplace-card p-8">
        <h2 className="text-2xl font-bold marketplace-text-primary mb-6">
          ข้อมูลบริษัท
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="marketplace-text-secondary">
                <strong>ก่อตั้งเมื่อ:</strong> {viewModel.companyInfo.founded}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-orange-600" />
              <span className="marketplace-text-secondary">
                <strong>ที่ตั้ง:</strong> {viewModel.companyInfo.location}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-orange-600" />
              <span className="marketplace-text-secondary">
                <strong>จำนวนพนักงาน:</strong> {viewModel.companyInfo.employees}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-orange-600" />
              <span className="marketplace-text-secondary">
                <strong>เว็บไซต์:</strong>
                <a
                  href={viewModel.companyInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 ml-1"
                >
                  {viewModel.companyInfo.website}
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="marketplace-card p-8 text-center bg-gradient-to-r from-orange-50 to-indigo-50 dark:from-orange-900/20 dark:to-indigo-900/20">
        <h2 className="text-2xl font-bold marketplace-text-primary mb-4">
          พร้อมเริ่มต้นกับเราแล้วหรือยัง?
        </h2>
        <p className="marketplace-text-secondary mb-6">
          มาร่วมเป็นส่วนหนึ่งของการปฏิวัติระบบจัดการคิวไปกับเรา
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="marketplace-button-primary px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            <Building className="h-5 w-5 mr-2" />
            เริ่มใช้งานเลย
          </Link>
          <Link
            href="/shop/contact"
            className="marketplace-button-secondary px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center"
          >
            ติดต่อเรา
          </Link>
        </div>
      </section>
    </div>
  );
}
