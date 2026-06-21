import { useState } from 'react'
import { Share2, Download, FileText, ChevronRight, ChevronDown, Plus, Settings2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { ESTIMATE_DATA } from '../../data/projectData'

const TABS = ['Estimate Summary', 'Line Items', 'Labor & Equipment', 'Markup & Overhead', 'Alternates', 'Notes']

const fmt = (n) => `$${n.toLocaleString()}`

export default function Estimates() {
  const [activeTab, setActiveTab] = useState('Estimate Summary')
  const d = ESTIMATE_DATA

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-0 border-b border-gray-200 dark:border-navy-700">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Project Estimate</h1>
              <ChevronDown size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" icon={Share2}>Share Estimate</Button>
              <Button variant="secondary" size="sm" icon={Download}>Export</Button>
              <Button size="sm">Create Proposal</Button>
            </div>
          </div>

          {/* Sub-header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{d.projectName}</span>
            <Badge status="Active" />
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{d.sf.toLocaleString()} SF</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{d.manufacturer}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{d.levels}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{d.date}</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-500'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'Estimate Summary' && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: 'Total Estimated Cost', value: fmt(d.summary.totalEstimatedCost), sub: 'USD', highlight: false },
                  { label: 'Cost per SF', value: `$${d.summary.costPerSf}`, sub: 'USD', highlight: false },
                  { label: 'Material Cost', value: fmt(d.summary.materialCost), sub: `${d.summary.materialPct}%`, highlight: false },
                  { label: 'Labor Cost', value: fmt(d.summary.laborCost), sub: `${d.summary.laborPct}%`, highlight: false },
                  { label: 'Gross Margin', value: fmt(d.summary.grossMargin), sub: `${d.summary.grossMarginPct}%`, highlight: false },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>

              {/* Breakdown table */}
              <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-navy-700">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Estimate Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-navy-700">
                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 w-48">Category</th>
                        {['Material (USD)', 'Labor (USD)', 'Equipment (USD)', 'Total (USD)', 'Cost per SF', '% of Total'].map((h) => (
                          <th key={h} className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {d.breakdown.map((row, i) => (
                        <tr key={row.category} className={`border-b border-gray-50 dark:border-navy-700/50 hover:bg-gray-50 dark:hover:bg-navy-700/30 transition-colors ${i === d.breakdown.length - 1 ? 'border-0' : ''}`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-gray-400 flex-shrink-0" />
                              <button type="button" className="text-sm text-gray-700 dark:text-gray-300 hover:text-teal-500 cursor-pointer text-left">
                                {row.category}
                              </button>
                              <ChevronRight size={12} className="text-gray-400" />
                            </div>
                          </td>
                          <td className="text-right px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.material ? fmt(row.material) : '$0'}</td>
                          <td className="text-right px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.labor ? fmt(row.labor) : '$0'}</td>
                          <td className="text-right px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.equipment ? fmt(row.equipment) : '$0'}</td>
                          <td className="text-right px-4 py-3 text-sm font-medium text-teal-500">{fmt(row.total)}</td>
                          <td className="text-right px-4 py-3 text-sm text-gray-700 dark:text-gray-300">${row.costPerSf.toFixed(2)}</td>
                          <td className="text-right px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.pct}%</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700/50">
                        <td className="px-5 py-3 text-sm font-semibold text-gray-800 dark:text-white">TOTAL</td>
                        <td className="text-right px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                          {fmt(d.breakdown.reduce((s, r) => s + r.material, 0))}
                        </td>
                        <td className="text-right px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                          {fmt(d.breakdown.reduce((s, r) => s + r.labor, 0))}
                        </td>
                        <td className="text-right px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                          {fmt(d.breakdown.reduce((s, r) => s + r.equipment, 0))}
                        </td>
                        <td className="text-right px-4 py-3 text-sm font-bold text-teal-500">
                          {fmt(d.breakdown.reduce((s, r) => s + r.total, 0))}
                        </td>
                        <td className="text-right px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">$65.56</td>
                        <td className="text-right px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">100%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-navy-700">
                  <Button variant="ghost" size="sm" icon={Plus}>Add Line Item</Button>
                  <Button variant="ghost" size="sm" icon={Settings2}>Customize Columns</Button>
                </div>
              </div>

              <p className="text-xs text-center text-gray-400">All values are estimates. Verify with local suppliers and subcontractors.</p>
            </div>
          )}

          {activeTab !== 'Estimate Summary' && (
            <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500 text-sm">
              {activeTab} — coming soon
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-64 flex-shrink-0 border-l border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 overflow-y-auto">
        <div className="p-5 space-y-5">
          {/* Estimate Total */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Estimate Total</h3>
              <button type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">•••</button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-xs font-medium text-gray-800 dark:text-white">{fmt(d.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Markup ({d.markupPct}%)</span>
                <span className="text-xs font-medium text-gray-800 dark:text-white">{fmt(Math.round(d.subtotal * d.markupPct / 100))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Contingency ({d.contingencyPct}%)</span>
                <span className="text-xs font-medium text-gray-800 dark:text-white">{fmt(Math.round(d.subtotal * d.contingencyPct / 100))}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-navy-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">GRAND TOTAL</span>
                  <span className="text-sm font-bold text-teal-500">{fmt(d.grandTotal)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total per SF</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300">${d.costPerSf}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Distribution */}
          <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Cost Distribution</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={d.costDistribution} dataKey="value" innerRadius={35} outerRadius={55} paddingAngle={2}>
                    {d.costDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {d.costDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.name}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Timeline */}
          <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Project Timeline Impact</h3>
            <div className="space-y-2">
              {[
                { label: 'Duration', value: `${d.timeline.durationWeeks} weeks` },
                { label: 'Start Date', value: d.timeline.startDate },
                { label: 'End Date', value: d.timeline.endDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
            <button type="button" className="flex items-center gap-1 text-xs text-teal-500 hover:text-teal-400 mt-2 cursor-pointer">
              View Timeline <ChevronRight size={12} />
            </button>
          </div>

          {/* Estimate Insights */}
          <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Estimate Insights</h3>
            <div className="space-y-2">
              {d.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
