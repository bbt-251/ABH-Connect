"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Plus, Search, MoreVertical, Edit, Trash2, Tag, Briefcase, X, Users } from "lucide-react"

interface Skill {
  id: string
  name: string
  description: string
  tags: string[]
  relatedPositions: string[]
}

interface Occupation {
  id: string
  title: string
  description: string
  category: string
  requiredSkills: string[]
  experienceLevel: string
  averageSalary: string
}

export default function SkillBasePage() {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: "SKL001",
      name: "JavaScript",
      description: "Programming language for web development, both frontend and backend applications.",
      tags: ["Programming", "Web Development", "Frontend", "Backend"],
      relatedPositions: ["Frontend Developer", "Full Stack Developer", "Web Developer", "Software Engineer"],
    },
    {
      id: "SKL002",
      name: "React",
      description: "JavaScript library for building user interfaces, particularly single-page applications.",
      tags: ["Frontend", "Web Development", "JavaScript", "UI/UX"],
      relatedPositions: ["Frontend Developer", "React Developer", "UI Developer"],
    },
    {
      id: "SKL003",
      name: "Python",
      description: "High-level programming language used for web development, data analysis, AI, and automation.",
      tags: ["Programming", "Data Science", "Backend", "AI/ML"],
      relatedPositions: ["Python Developer", "Data Scientist", "Backend Developer", "ML Engineer"],
    },
    {
      id: "SKL004",
      name: "Project Management",
      description: "Planning, executing, and closing projects while managing teams and resources effectively.",
      tags: ["Management", "Leadership", "Planning", "Communication"],
      relatedPositions: ["Project Manager", "Scrum Master", "Product Manager", "Team Lead"],
    },
    {
      id: "SKL005",
      name: "SQL",
      description: "Structured Query Language for managing and manipulating relational databases.",
      tags: ["Database", "Backend", "Data Analysis", "Programming"],
      relatedPositions: ["Database Administrator", "Data Analyst", "Backend Developer", "Data Engineer"],
    },
    {
      id: "SKL006",
      name: "UI/UX Design",
      description: "User interface and user experience design for creating intuitive and engaging digital products.",
      tags: ["Design", "UI/UX", "Creative", "User Research"],
      relatedPositions: ["UI Designer", "UX Designer", "Product Designer", "Visual Designer"],
    },
  ])

  const [occupations, setOccupations] = useState<Occupation[]>([
    {
      id: "OCC001",
      title: "Frontend Developer",
      description: "Develops user-facing web applications and interfaces using modern frameworks and technologies.",
      category: "Software Development",
      requiredSkills: ["JavaScript", "React", "HTML/CSS", "UI/UX Design"],
      experienceLevel: "Mid-level",
      averageSalary: "$75,000 - $95,000",
    },
    {
      id: "OCC002",
      title: "Data Scientist",
      description: "Analyzes complex data to extract insights and build predictive models for business decisions.",
      category: "Data & Analytics",
      requiredSkills: ["Python", "SQL", "Machine Learning", "Statistics"],
      experienceLevel: "Senior",
      averageSalary: "$90,000 - $130,000",
    },
    {
      id: "OCC003",
      title: "Project Manager",
      description: "Leads cross-functional teams to deliver projects on time, within scope, and budget.",
      category: "Management",
      requiredSkills: ["Project Management", "Leadership", "Communication", "Agile"],
      experienceLevel: "Mid-level",
      averageSalary: "$70,000 - $100,000",
    },
    {
      id: "OCC004",
      title: "Full Stack Developer",
      description: "Develops both frontend and backend components of web applications and systems.",
      category: "Software Development",
      requiredSkills: ["JavaScript", "Python", "React", "SQL", "Node.js"],
      experienceLevel: "Senior",
      averageSalary: "$80,000 - $120,000",
    },
    {
      id: "OCC005",
      title: "UI/UX Designer",
      description: "Creates user-centered designs for digital products, focusing on usability and aesthetics.",
      category: "Design",
      requiredSkills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
      experienceLevel: "Mid-level",
      averageSalary: "$65,000 - $85,000",
    },
    {
      id: "OCC006",
      title: "DevOps Engineer",
      description: "Manages infrastructure, deployment pipelines, and ensures system reliability and scalability.",
      category: "Infrastructure",
      requiredSkills: ["Cloud Computing", "Docker", "Kubernetes", "CI/CD"],
      experienceLevel: "Senior",
      averageSalary: "$85,000 - $125,000",
    },
  ])

  const [skillSearchTerm, setSkillSearchTerm] = useState("")
  const [occupationSearchTerm, setOccupationSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isCreateSkillModalOpen, setIsCreateSkillModalOpen] = useState(false)
  const [isCreateOccupationModalOpen, setIsCreateOccupationModalOpen] = useState(false)
  const [isEditSkillModalOpen, setIsEditSkillModalOpen] = useState(false)
  const [isEditOccupationModalOpen, setIsEditOccupationModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingOccupation, setEditingOccupation] = useState<Occupation | null>(null)
  const [newSkill, setNewSkill] = useState<Omit<Skill, "id">>({
    name: "",
    description: "",
    tags: [],
    relatedPositions: [],
  })
  const [newOccupation, setNewOccupation] = useState<Omit<Occupation, "id">>({
    title: "",
    description: "",
    category: "",
    requiredSkills: [],
    experienceLevel: "",
    averageSalary: "",
  })

  const availableTags = [
    "Programming",
    "Web Development",
    "Frontend",
    "Backend",
    "Mobile",
    "Database",
    "AI/ML",
    "Data Science",
    "Cloud",
    "DevOps",
    "Security",
    "UI/UX",
    "Design",
    "Management",
    "Leadership",
    "Communication",
  ]

  const availableCategories = [
    "Software Development",
    "Data & Analytics",
    "Design",
    "Management",
    "Infrastructure",
    "Marketing",
    "Sales",
    "Finance",
    "Human Resources",
  ]

  const experienceLevels = ["Entry-level", "Mid-level", "Senior", "Executive"]

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(skillSearchTerm.toLowerCase())
    const matchesTag = !selectedTag || selectedTag === "all-tags" || skill.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const filteredOccupations = occupations.filter((occupation) => {
    const matchesSearch =
      occupation.title.toLowerCase().includes(occupationSearchTerm.toLowerCase()) ||
      occupation.description.toLowerCase().includes(occupationSearchTerm.toLowerCase())
    const matchesCategory =
      !selectedCategory || selectedCategory === "all-categories" || occupation.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const generateSkillId = () => {
    const maxId = skills.reduce((max, skill) => {
      const num = Number.parseInt(skill.id.replace("SKL", ""))
      return num > max ? num : max
    }, 0)
    return `SKL${String(maxId + 1).padStart(3, "0")}`
  }

  const generateOccupationId = () => {
    const maxId = occupations.reduce((max, occupation) => {
      const num = Number.parseInt(occupation.id.replace("OCC", ""))
      return num > max ? num : max
    }, 0)
    return `OCC${String(maxId + 1).padStart(3, "0")}`
  }

  const handleCreateSkill = () => {
    if (newSkill.name && newSkill.description) {
      const skill: Skill = {
        ...newSkill,
        id: generateSkillId(),
      }
      setSkills([...skills, skill])
      setNewSkill({ name: "", description: "", tags: [], relatedPositions: [] })
      setIsCreateSkillModalOpen(false)
    }
  }

  const handleCreateOccupation = () => {
    if (newOccupation.title && newOccupation.description) {
      const occupation: Occupation = {
        ...newOccupation,
        id: generateOccupationId(),
      }
      setOccupations([...occupations, occupation])
      setNewOccupation({
        title: "",
        description: "",
        category: "",
        requiredSkills: [],
        experienceLevel: "",
        averageSalary: "",
      })
      setIsCreateOccupationModalOpen(false)
    }
  }

  const handleEditSkill = () => {
    if (editingSkill) {
      setSkills(skills.map((skill) => (skill.id === editingSkill.id ? editingSkill : skill)))
      setEditingSkill(null)
      setIsEditSkillModalOpen(false)
    }
  }

  const handleEditOccupation = () => {
    if (editingOccupation) {
      setOccupations(
        occupations.map((occupation) => (occupation.id === editingOccupation.id ? editingOccupation : occupation)),
      )
      setEditingOccupation(null)
      setIsEditOccupationModalOpen(false)
    }
  }

  const handleDeleteSkill = (skillId: string) => {
    setSkills(skills.filter((skill) => skill.id !== skillId))
  }

  const handleDeleteOccupation = (occupationId: string) => {
    setOccupations(occupations.filter((occupation) => occupation.id !== occupationId))
  }

  const addSkillTag = (skillData: Omit<Skill, "id"> | Skill, tag: string, isEditing = false) => {
    if (!skillData.tags.includes(tag)) {
      const updatedTags = [...skillData.tags, tag]
      if (isEditing && "id" in skillData) {
        setEditingSkill({ ...skillData, tags: updatedTags })
      } else {
        setNewSkill({ ...(skillData as Omit<Skill, "id">), tags: updatedTags })
      }
    }
  }

  const removeSkillTag = (skillData: Omit<Skill, "id"> | Skill, tag: string, isEditing = false) => {
    const updatedTags = skillData.tags.filter((t) => t !== tag)
    if (isEditing && "id" in skillData) {
      setEditingSkill({ ...skillData, tags: updatedTags })
    } else {
      setNewSkill({ ...(skillData as Omit<Skill, "id">), tags: updatedTags })
    }
  }

  const addRequiredSkill = (occupationData: Omit<Occupation, "id"> | Occupation, skill: string, isEditing = false) => {
    if (!occupationData.requiredSkills.includes(skill)) {
      const updatedSkills = [...occupationData.requiredSkills, skill]
      if (isEditing && "id" in occupationData) {
        setEditingOccupation({ ...occupationData, requiredSkills: updatedSkills })
      } else {
        setNewOccupation({ ...(occupationData as Omit<Occupation, "id">), requiredSkills: updatedSkills })
      }
    }
  }

  const removeRequiredSkill = (
    occupationData: Omit<Occupation, "id"> | Occupation,
    skill: string,
    isEditing = false,
  ) => {
    const updatedSkills = occupationData.requiredSkills.filter((s) => s !== skill)
    if (isEditing && "id" in occupationData) {
      setEditingOccupation({ ...occupationData, requiredSkills: updatedSkills })
    } else {
      setNewOccupation({ ...(occupationData as Omit<Occupation, "id">), requiredSkills: updatedSkills })
    }
  }

  const uniqueTags = Array.from(new Set(skills.flatMap((skill) => skill.tags)))
  const uniqueCategories = Array.from(new Set(occupations.map((occupation) => occupation.category)))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="h-8 w-8 text-pink-600 mr-3" />
                Skill Base Management
              </h1>
              <p className="text-gray-600 mt-1">Manage skills and occupations in the system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Skills</p>
                  <p className="text-3xl font-bold text-gray-900">{skills.length}</p>
                </div>
                <Brain className="h-8 w-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Occupations</p>
                  <p className="text-3xl font-bold text-gray-900">{occupations.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Tags</p>
                  <p className="text-3xl font-bold text-gray-900">{uniqueTags.length}</p>
                </div>
                <Tag className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-3xl font-bold text-gray-900">{uniqueCategories.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="occupations">Occupations</TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search skills..."
                    value={skillSearchTerm}
                    onChange={(e) => setSkillSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-tags">All Tags</SelectItem>
                    {uniqueTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isCreateSkillModalOpen} onOpenChange={setIsCreateSkillModalOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Skill</DialogTitle>
                    <DialogDescription>Add a new skill to the skill base.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="skill-name">Skill Name</Label>
                      <Input
                        id="skill-name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        placeholder="Enter skill name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="skill-description">Description</Label>
                      <Textarea
                        id="skill-description"
                        value={newSkill.description}
                        onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                        placeholder="Enter skill description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newSkill.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkillTag(newSkill, tag)} />
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={(value) => addSkillTag(newSkill, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add tags" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags
                            .filter((tag) => !newSkill.tags.includes(tag))
                            .map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateSkillModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateSkill}>Create Skill</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Related Positions</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSkills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.id}</TableCell>
                      <TableCell className="font-semibold">{skill.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{skill.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {skill.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {skill.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{skill.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {skill.relatedPositions.slice(0, 2).map((position, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {position}
                            </Badge>
                          ))}
                          {skill.relatedPositions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{skill.relatedPositions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingSkill(skill)
                                setIsEditSkillModalOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteSkill(skill.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Occupations Tab */}
          <TabsContent value="occupations" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search occupations..."
                    value={occupationSearchTerm}
                    onChange={(e) => setOccupationSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isCreateOccupationModalOpen} onOpenChange={setIsCreateOccupationModalOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Occupation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Occupation</DialogTitle>
                    <DialogDescription>Add a new occupation to the system.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="occupation-title">Occupation Title</Label>
                      <Input
                        id="occupation-title"
                        value={newOccupation.title}
                        onChange={(e) => setNewOccupation({ ...newOccupation, title: e.target.value })}
                        placeholder="Enter occupation title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="occupation-description">Description</Label>
                      <Textarea
                        id="occupation-description"
                        value={newOccupation.description}
                        onChange={(e) => setNewOccupation({ ...newOccupation, description: e.target.value })}
                        placeholder="Enter occupation description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select onValueChange={(value) => setNewOccupation({ ...newOccupation, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Experience Level</Label>
                      <Select onValueChange={(value) => setNewOccupation({ ...newOccupation, experienceLevel: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="average-salary">Average Salary</Label>
                      <Input
                        id="average-salary"
                        value={newOccupation.averageSalary}
                        onChange={(e) => setNewOccupation({ ...newOccupation, averageSalary: e.target.value })}
                        placeholder="e.g., $70,000 - $90,000"
                      />
                    </div>
                    <div>
                      <Label>Required Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newOccupation.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeRequiredSkill(newOccupation, skill)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={(value) => addRequiredSkill(newOccupation, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add required skills" />
                        </SelectTrigger>
                        <SelectContent>
                          {skills
                            .filter((skill) => !newOccupation.requiredSkills.includes(skill.name))
                            .map((skill) => (
                              <SelectItem key={skill.id} value={skill.name}>
                                {skill.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOccupationModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateOccupation}>Create Occupation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Experience Level</TableHead>
                    <TableHead>Required Skills</TableHead>
                    <TableHead>Average Salary</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOccupations.map((occupation) => (
                    <TableRow key={occupation.id}>
                      <TableCell className="font-medium">{occupation.id}</TableCell>
                      <TableCell className="font-semibold">{occupation.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{occupation.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{occupation.experienceLevel}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {occupation.requiredSkills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {occupation.requiredSkills.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{occupation.requiredSkills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{occupation.averageSalary}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingOccupation(occupation)
                                setIsEditOccupationModalOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOccupation(occupation.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Skill Modal */}
        <Dialog open={isEditSkillModalOpen} onOpenChange={setIsEditSkillModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Skill</DialogTitle>
              <DialogDescription>Update skill information and tags.</DialogDescription>
            </DialogHeader>
            {editingSkill && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-skill-name">Skill Name</Label>
                  <Input
                    id="edit-skill-name"
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    placeholder="Enter skill name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-skill-description">Description</Label>
                  <Textarea
                    id="edit-skill-description"
                    value={editingSkill.description}
                    onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                    placeholder="Enter skill description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingSkill.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkillTag(editingSkill, tag, true)} />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => addSkillTag(editingSkill, value, true)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags
                        .filter((tag) => !editingSkill.tags.includes(tag))
                        .map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditSkillModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSkill}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Occupation Modal */}
        <Dialog open={isEditOccupationModalOpen} onOpenChange={setIsEditOccupationModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Occupation</DialogTitle>
              <DialogDescription>Update occupation information and requirements.</DialogDescription>
            </DialogHeader>
            {editingOccupation && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-occupation-title">Occupation Title</Label>
                  <Input
                    id="edit-occupation-title"
                    value={editingOccupation.title}
                    onChange={(e) => setEditingOccupation({ ...editingOccupation, title: e.target.value })}
                    placeholder="Enter occupation title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-occupation-description">Description</Label>
                  <Textarea
                    id="edit-occupation-description"
                    value={editingOccupation.description}
                    onChange={(e) => setEditingOccupation({ ...editingOccupation, description: e.target.value })}
                    placeholder="Enter occupation description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={editingOccupation.category}
                    onValueChange={(value) => setEditingOccupation({ ...editingOccupation, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Experience Level</Label>
                  <Select
                    value={editingOccupation.experienceLevel}
                    onValueChange={(value) => setEditingOccupation({ ...editingOccupation, experienceLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-average-salary">Average Salary</Label>
                  <Input
                    id="edit-average-salary"
                    value={editingOccupation.averageSalary}
                    onChange={(e) => setEditingOccupation({ ...editingOccupation, averageSalary: e.target.value })}
                    placeholder="e.g., $70,000 - $90,000"
                  />
                </div>
                <div>
                  <Label>Required Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingOccupation.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeRequiredSkill(editingOccupation, skill, true)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => addRequiredSkill(editingOccupation, value, true)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add required skills" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills
                        .filter((skill) => !editingOccupation.requiredSkills.includes(skill.name))
                        .map((skill) => (
                          <SelectItem key={skill.id} value={skill.name}>
                            {skill.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOccupationModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditOccupation}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
