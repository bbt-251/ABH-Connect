"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, X } from "lucide-react"

interface Metric {
  id: string
  name: string
  threshold: number
  weight: number
}

interface EvaluationMetric {
  id: string
  name: string
  passingScore: number
  metrics: Metric[]
  createdAt: string
  status: "active" | "inactive"
}

export default function EvaluationMetricsPage() {
  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetric[]>([
    {
      id: "1",
      name: "Software Engineer Evaluation",
      passingScore: 75,
      metrics: [
        { id: "1", name: "Technical Skills", threshold: 4, weight: 40 },
        { id: "2", name: "Problem Solving", threshold: 3, weight: 30 },
        { id: "3", name: "Communication", threshold: 3, weight: 30 },
      ],
      createdAt: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Marketing Manager Assessment",
      passingScore: 70,
      metrics: [
        { id: "4", name: "Strategic Thinking", threshold: 4, weight: 35 },
        { id: "5", name: "Creativity", threshold: 3, weight: 25 },
        { id: "6", name: "Leadership", threshold: 3, weight: 25 },
        { id: "7", name: "Communication", threshold: 4, weight: 15 },
      ],
      createdAt: "2024-01-10",
      status: "active",
    },
  ])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingMetric, setEditingMetric] = useState<EvaluationMetric | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    passingScore: "",
    status: "active" as "active" | "inactive",
    metrics: [{ id: Date.now().toString(), name: "", threshold: 1, weight: 0 }],
  })

  const handleCreateMetric = () => {
    setFormData({
      name: "",
      passingScore: "",
      status: "active",
      metrics: [{ id: Date.now().toString(), name: "", threshold: 1, weight: 0 }],
    })
    setEditingMetric(null)
    setIsCreateModalOpen(true)
  }

  const handleEditMetric = (metric: EvaluationMetric) => {
    setFormData({
      name: metric.name,
      passingScore: metric.passingScore.toString(),
      status: metric.status,
      metrics: metric.metrics,
    })
    setEditingMetric(metric)
    setIsCreateModalOpen(true)
  }

  const handleDeleteMetric = (metricId: string) => {
    setEvaluationMetrics(evaluationMetrics.filter((metric) => metric.id !== metricId))
  }

  const handleAddMetric = () => {
    setFormData({
      ...formData,
      metrics: [...formData.metrics, { id: Date.now().toString(), name: "", threshold: 1, weight: 0 }],
    })
  }

  const handleRemoveMetric = (metricId: string) => {
    setFormData({
      ...formData,
      metrics: formData.metrics.filter((metric) => metric.id !== metricId),
    })
  }

  const handleMetricChange = (metricId: string, field: string, value: string | number) => {
    setFormData({
      ...formData,
      metrics: formData.metrics.map((metric) => (metric.id === metricId ? { ...metric, [field]: value } : metric)),
    })
  }

  const handleSubmit = () => {
    const newMetric: EvaluationMetric = {
      id: editingMetric?.id || Date.now().toString(),
      name: formData.name,
      passingScore: Number.parseInt(formData.passingScore),
      status: formData.status,
      metrics: formData.metrics.filter((metric) => metric.name),
      createdAt: editingMetric?.createdAt || new Date().toISOString().split("T")[0],
    }

    if (editingMetric) {
      setEvaluationMetrics(evaluationMetrics.map((metric) => (metric.id === editingMetric.id ? newMetric : metric)))
    } else {
      setEvaluationMetrics([...evaluationMetrics, newMetric])
    }

    setIsCreateModalOpen(false)
    setFormData({
      name: "",
      passingScore: "",
      status: "active",
      metrics: [{ id: Date.now().toString(), name: "", threshold: 1, weight: 0 }],
    })
  }

  const getTotalWeight = () => {
    return formData.metrics.reduce((total, metric) => total + (metric.weight || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluation Metrics</h1>
          <p className="text-gray-600">Define metrics that evaluators will use to assess applicant fitness</p>
        </div>
        <Button onClick={handleCreateMetric}>
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
      </div>

      {/* Evaluation Metrics List */}
      <div className="grid gap-4">
        {evaluationMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={metric.status === "active" ? "default" : "secondary"}>{metric.status}</Badge>
                    <span className="text-sm text-gray-600">Passing Score: {metric.passingScore}%</span>
                    <span className="text-sm text-gray-600">Created: {metric.createdAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditMetric(metric)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteMetric(metric.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Evaluation Metrics ({metric.metrics.length})</h4>
                <div className="grid gap-2">
                  {metric.metrics.map((evalMetric) => (
                    <div key={evalMetric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{evalMetric.name}</div>
                        <div className="text-xs text-gray-600">
                          Threshold: {evalMetric.threshold}/5 • Weight: {evalMetric.weight}%
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">Threshold: {evalMetric.threshold}/5</Badge>
                        <Badge variant="outline">{evalMetric.weight}% weight</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMetric ? "Edit Evaluation Metric" : "Create New Evaluation Metric"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Software Engineer Evaluation"
                />
              </div>

              <div>
                <Label htmlFor="passingScore">Passing Score *</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                  placeholder="e.g., 75"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <Label>Status</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={formData.status === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, status: "active" })}
                  >
                    Active
                  </Button>
                  <Button
                    type="button"
                    variant={formData.status === "inactive" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, status: "inactive" })}
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </div>

            {/* List of Metrics */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>List of Metrics</Label>
                <div className="text-sm text-gray-600">
                  Total Weight: {getTotalWeight()}%
                  {getTotalWeight() !== 100 && <span className="text-red-500 ml-2">(Should equal 100%)</span>}
                </div>
              </div>

              <div className="space-y-3">
                {formData.metrics.map((metric, index) => (
                  <div key={metric.id} className="flex gap-3 items-start p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">Metric Name</Label>
                        <Input
                          value={metric.name}
                          onChange={(e) => handleMetricChange(metric.id, "name", e.target.value)}
                          placeholder="e.g., Technical Skills"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600">Metric Threshold (1-5)</Label>
                        <Input
                          type="number"
                          value={metric.threshold}
                          onChange={(e) =>
                            handleMetricChange(metric.id, "threshold", Number.parseInt(e.target.value) || 1)
                          }
                          placeholder="1-5"
                          min="1"
                          max="5"
                        />
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600">Metric Weight (%)</Label>
                        <Input
                          type="number"
                          value={metric.weight}
                          onChange={(e) =>
                            handleMetricChange(metric.id, "weight", Number.parseInt(e.target.value) || 0)
                          }
                          placeholder="Weight %"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    {formData.metrics.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => handleRemoveMetric(metric.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline" onClick={handleAddMetric} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.passingScore || getTotalWeight() !== 100}
              >
                {editingMetric ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
