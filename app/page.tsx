import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, DollarSign, Users, FileText, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl mb-6">
            Expense Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your expense reporting, approval workflows, and financial tracking with our comprehensive management platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer">
                Launch Application <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Expense Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Submit and track expenses with receipt uploads and automatic categorization.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Team Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage users, roles, and approval workflows across your organization.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Approval Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Configure custom approval rules based on amount, category, and hierarchy.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate comprehensive reports and gain insights into spending patterns.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Quick Access</h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="outline" asChild>
              <a href="http://localhost:3001/login" target="_blank" rel="noopener noreferrer">
                Employee Login
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="http://localhost:3001/signup" target="_blank" rel="noopener noreferrer">
                Sign Up
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer">
                API Documentation
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
