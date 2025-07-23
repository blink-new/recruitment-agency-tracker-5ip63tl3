import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockApplications, mockCandidates, mockJobs, mockClients } from '@/data/mockData'
import { APPLICATION_STATUS_LABELS, APPLICATION_STAGE_LABELS } from '@/types'
import { Users, Briefcase, Building2, FileText, TrendingUp, Clock } from 'lucide-react'

export default function Dashboard() {
  const totalCandidates = mockCandidates.length
  const totalJobs = mockJobs.length
  const totalClients = mockClients.length
  const totalApplications = mockApplications.length

  const activeApplications = mockApplications.filter(app => app.applicationStage < 4).length
  const recentApplications = mockApplications
    .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
    .slice(0, 5)

  const stats = [
    {
      title: 'Total Candidates',
      value: totalCandidates,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Jobs',
      value: totalJobs,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Clients',
      value: totalClients,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Applications',
      value: totalApplications,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your recruitment activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Applications</span>
            </CardTitle>
            <CardDescription>
              Latest candidate applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const candidate = mockCandidates.find(c => c.id === app.candidateId)
                const job = mockJobs.find(j => j.id === app.jobId)
                
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {candidate?.firstName} {candidate?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{job?.jobTitle}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(app.createdOn).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="mb-1">
                        {APPLICATION_STAGE_LABELS[app.applicationStage as keyof typeof APPLICATION_STAGE_LABELS]}
                      </Badge>
                      <p className="text-xs text-gray-500">{app.currentCompany}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Pipeline Status</span>
            </CardTitle>
            <CardDescription>
              Applications by stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(APPLICATION_STAGE_LABELS).map(([stage, label]) => {
                const count = mockApplications.filter(app => app.applicationStage === parseInt(stage)).length
                const percentage = totalApplications > 0 ? (count / totalApplications) * 100 : 0
                
                return (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}