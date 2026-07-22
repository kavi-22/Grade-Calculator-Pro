"use client";

import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import {
  Plus, Trash2, Calculator, TrendingUp, Award, BookOpen,
  Download, RotateCcw, ChevronDown, ChevronUp, Sparkles,
  GraduationCap, Target, Zap
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Legend
} from "recharts";

interface Subject {
  id: number;
  name: string;
  marks: number;
  totalMarks: number;
  credits: number;
}

const GRADE_SCALE = [
  { min: 90, grade: "A+", gpa: 10, label: "Outstanding", color: "#10b981" },
  { min: 80, grade: "A", gpa: 9, label: "Excellent", color: "#34d399" },
  { min: 70, grade: "B+", gpa: 8, label: "Very Good", color: "#60a5fa" },
  { min: 60, grade: "B", gpa: 7, label: "Good", color: "#93c5fd" },
  { min: 50, grade: "C+", gpa: 6, label: "Above Average", color: "#fbbf24" },
  { min: 40, grade: "C", gpa: 5, label: "Average", color: "#fcd34d" },
  { min: 35, grade: "D", gpa: 4, label: "Pass", color: "#fb923c" },
  { min: 0, grade: "F", gpa: 0, label: "Fail", color: "#ef4444" },
];

function getGradeInfo(percentage: number) {
  return GRADE_SCALE.find((g) => percentage >= g.min) || GRADE_SCALE[GRADE_SCALE.length - 1];
}

export default function GradeCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Mathematics", marks: 85, totalMarks: 100, credits: 4 },
    { id: 2, name: "Physics", marks: 78, totalMarks: 100, credits: 4 },
    { id: 3, name: "Chemistry", marks: 72, totalMarks: 100, credits: 3 },
    { id: 4, name: "English", marks: 88, totalMarks: 100, credits: 2 },
  ]);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const addSubject = () => {
    const newId = Math.max(...subjects.map((s) => s.id), 0) + 1;
    setSubjects([...subjects, { id: newId, name: "", marks: 0, totalMarks: 100, credits: 3 }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) setSubjects(subjects.filter((s) => s.id !== id));
  };

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const resetAll = () => {
    setSubjects([{ id: 1, name: "", marks: 0, totalMarks: 100, credits: 3 }]);
  };

  const stats = useMemo(() => {
    const validSubjects = subjects.filter((s) => s.totalMarks > 0);
    const totalObtained = validSubjects.reduce((sum, s) => sum + Number(s.marks), 0);
    const totalPossible = validSubjects.reduce((sum, s) => sum + Number(s.totalMarks), 0);
    const totalCredits = validSubjects.reduce((sum, s) => sum + Number(s.credits), 0);
    const percentage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;
    const gradeInfo = getGradeInfo(percentage);

    // Weighted GPA calculation
    const weightedGpaSum = validSubjects.reduce((sum, s) => {
      const pct = (Number(s.marks) / Number(s.totalMarks)) * 100;
      const g = getGradeInfo(pct);
      return sum + g.gpa * Number(s.credits);
    }, 0);
    const cgpa = totalCredits > 0 ? weightedGpaSum / totalCredits : 0;

    return { totalObtained, totalPossible, percentage, gradeInfo, cgpa, totalCredits };
  }, [subjects]);

  const chartData = useMemo(() => {
    return subjects
      .filter((s) => s.name && s.totalMarks > 0)
      .map((s) => ({
        name: s.name.length > 12 ? s.name.slice(0, 12) + "..." : s.name,
        percentage: Math.round((Number(s.marks) / Number(s.totalMarks)) * 100),
        marks: Number(s.marks),
        total: Number(s.totalMarks),
      }));
  }, [subjects]);

  const gradeDistribution = useMemo(() => {
    const dist = GRADE_SCALE.map((g) => ({ name: g.grade, value: 0, color: g.color })).reverse();
    subjects.forEach((s) => {
      if (s.totalMarks > 0) {
        const pct = (Number(s.marks) / Number(s.totalMarks)) * 100;
        const grade = getGradeInfo(pct);
        const item = dist.find((d) => d.name === grade.grade);
        if (item) item.value += 1;
      }
    });
    return dist.filter((d) => d.value > 0);
  }, [subjects]);

  const radarData = useMemo(() => {
    return subjects
      .filter((s) => s.name && s.totalMarks > 0)
      .map((s) => ({
        subject: s.name.length > 10 ? s.name.slice(0, 10) : s.name,
        A: Math.round((Number(s.marks) / Number(s.totalMarks)) * 100),
        fullMark: 100,
      }));
  }, [subjects]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Head><title>Grade Calculator Pro</title></Head>

      {/* Header */}
      <header className="bg-slate-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Grade Calculator Pro</h1>
              <p className="text-slate-400 text-xs">Advanced Academic Analytics</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors">
              <RotateCcw size={14} /> Reset
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors text-slate-900">
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Target} label="Overall %" value={`${stats.percentage.toFixed(1)}%`} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard icon={Award} label="Grade" value={stats.gradeInfo.grade} color="text-blue-600" bg="bg-blue-50" sub={stats.gradeInfo.label} />
          <StatCard icon={Zap} label="CGPA" value={stats.cgpa.toFixed(2)} color="text-amber-600" bg="bg-amber-50" sub={`/ ${stats.totalCredits} Credits`} />
          <StatCard icon={BookOpen} label="Subjects" value={subjects.length.toString()} color="text-purple-600" bg="bg-purple-50" sub={`${stats.totalObtained}/${stats.totalPossible} Marks`} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Input */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Calculator size={20} className="text-emerald-500" />
                  Subject Marks
                </h2>
                <button onClick={addSubject} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                  <Plus size={16} /> Add Subject
                </button>
              </div>
              <div className="p-6 space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="grid grid-cols-12 gap-3 items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="col-span-12 md:col-span-4">
                      <label className="text-xs text-slate-500 mb-1 block">Subject Name</label>
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                        placeholder={`Subject ${index + 1}`}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="text-xs text-slate-500 mb-1 block">Marks</label>
                      <input
                        type="number"
                        value={subject.marks}
                        onChange={(e) => updateSubject(subject.id, "marks", Number(e.target.value))}
                        min={0}
                        max={subject.totalMarks}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <label className="text-xs text-slate-500 mb-1 block">Total</label>
                      <input
                        type="number"
                        value={subject.totalMarks}
                        onChange={(e) => updateSubject(subject.id, "totalMarks", Number(e.target.value))}
                        min={1}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <label className="text-xs text-slate-500 mb-1 block">Credits</label>
                      <input
                        type="number"
                        value={subject.credits}
                        onChange={(e) => updateSubject(subject.id, "credits", Number(e.target.value))}
                        min={1}
                        max={10}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-1 flex justify-end">
                      <button
                        onClick={() => removeSubject(subject.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove subject"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {subject.totalMarks > 0 && (
                      <div className="col-span-12">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min((subject.marks / subject.totalMarks) * 100, 100)}%`,
                                backgroundColor: getGradeInfo((subject.marks / subject.totalMarks) * 100).color,
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 min-w-[50px] text-right">
                            {Math.round((subject.marks / subject.totalMarks) * 100)}%
                          </span>
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-full min-w-[40px] text-center"
                            style={{
                              backgroundColor: getGradeInfo((subject.marks / subject.totalMarks) * 100).color + "20",
                              color: getGradeInfo((subject.marks / subject.totalMarks) * 100).color,
                            }}
                          >
                            {getGradeInfo((subject.marks / subject.totalMarks) * 100).grade}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Scale Reference */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award size={18} className="text-emerald-500" /> Grade Scale Reference
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {GRADE_SCALE.map((g) => (
                  <div key={g.grade} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                    <div>
                      <span className="text-sm font-bold">{g.grade}</span>
                      <span className="text-xs text-slate-500 ml-1">({g.min}%+)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Analytics */}
          <div className="space-y-6">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <span className="font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" /> Analytics
              </span>
              {showAnalytics ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showAnalytics && (
              <>
                {/* Bar Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-sm font-bold text-slate-700 mb-4">Performance by Subject</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                      <Bar dataKey="percentage" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                {gradeDistribution.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Grade Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name} (${value})`}
                          labelLine={false}
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Radar Chart */}
                {radarData.length > 2 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Skill Radar</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar name="Performance" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} />
                    <h3 className="font-bold">Result Summary</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="opacity-80">Total Marks</span><span className="font-semibold">{stats.totalObtained} / {stats.totalPossible}</span></div>
                    <div className="flex justify-between"><span className="opacity-80">Percentage</span><span className="font-semibold">{stats.percentage.toFixed(2)}%</span></div>
                    <div className="flex justify-between"><span className="opacity-80">Grade</span><span className="font-semibold">{stats.gradeInfo.grade} - {stats.gradeInfo.label}</span></div>
                    <div className="flex justify-between"><span className="opacity-80">CGPA</span><span className="font-semibold">{stats.cgpa.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="opacity-80">Total Credits</span><span className="font-semibold">{stats.totalCredits}</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs opacity-80">
                      {stats.percentage >= 90
                        ? "Outstanding performance! Keep it up!"
                        : stats.percentage >= 70
                        ? "Great job! Room for improvement."
                        : stats.percentage >= 50
                        ? "Good effort. Focus on weak areas."
                        : "Needs improvement. Seek help if needed."}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-12">
        <p>Built with Next.js, Recharts & Tailwind CSS</p>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg, sub }: { icon: any; label: string; value: string; color: string; bg: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon size={20} className={color} />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
