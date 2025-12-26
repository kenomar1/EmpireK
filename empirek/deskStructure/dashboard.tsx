// empirek/deskStructure/dashboard.tsx
import React from 'react'
import {Card, Stack, Text, Grid, Button, Flex, Box, Heading, Badge, Dialog} from '@sanity/ui'
import {
  DashboardIcon,
  DocumentsIcon,
  UsersIcon,
  CommentIcon,
  FolderIcon,
  TagIcon,
  CogIcon,
  AddCircleIcon,
  TrashIcon,
  RefreshIcon,
  ArrowRightIcon,
} from '@sanity/icons'
import {useClient} from 'sanity'

const CustomDashboard = () => {
  const client = useClient({apiVersion: '2024-01-01'})

  const [counts, setCounts] = React.useState({
    posts: 0,
    authors: 0,
    services: 0,
    projects: 0,
    comments: 0,
    categories: 0,
  })

  const [recentPosts, setRecentPosts] = React.useState<any[]>([])
  const [recentComments, setRecentComments] = React.useState<any[]>([])

  const [showDialog, setShowDialog] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState<string>('')

  React.useEffect(() => {
    client
      .fetch(
        `{
      "posts": count(*[_type == "post"]),
      "authors": count(*[_type == "author"]),
      "services": count(*[_type == "service"]),
      "projects": count(*[_type == "project"]),
      "comments": count(*[_type == "comment"]),
      "categories": count(*[_type == "category"])
    }`,
      )
      .then(setCounts)

    client
      .fetch(
        `*[_type == "post"] | order(publishedAt desc) [0..5] {
      _id, title, "author": author->name, publishedAt, "slug": slug.current
    }`,
      )
      .then(setRecentPosts)

    client
      .fetch(
        `*[_type == "comment"] | order(createdAt desc) [0..5] {
      _id, name, message, createdAt, "postTitle": post->title
    }`,
      )
      .then(setRecentComments)
  }, [client])

  const quickCreate = (type: string) => {
    window.location.href = `/intent/create/type=${type}`
  }

  const goToList = (type: string) => {
    window.location.href = `/desk/${type}`
  }

  const deleteAll = async (type: string, label: string) => {
    setDeleting(type)
    try {
      await client.delete({query: `*[_type == "${type}"]`})
      alert(`All ${label} have been permanently deleted!`)
      setCounts((prev) => ({...prev, [type + 's']: 0}))
      if (type === 'post') setRecentPosts([])
      if (type === 'comment') setRecentComments([])
    } catch (err) {
      alert(`Failed to delete ${label.toLowerCase()}.`)
      console.error(err)
    } finally {
      setDeleting('')
      setShowDialog(null)
    }
  }

  const confirmDelete = (type: string, label: string, count: number) => {
    setShowDialog(`${type}-${count}`)
  }

  return (
    <Card padding={6} radius={4} shadow={2}>
      <Stack space={6}>
        {/* Header */}
        <Flex align="center" gap={4}>
          <DashboardIcon style={{fontSize: 48}} />
          <Heading size={5}>EmpireK Dashboard</Heading>
        </Flex>

        {/* Stats Grid */}
        <Grid columns={[2, 3, 6]} gap={5}>
          <StatCard
            title="Blog Posts"
            count={counts.posts}
            icon={<DocumentsIcon />}
            color="primary"
            onClick={() => goToList('post')}
          />
          <StatCard
            title="Authors"
            count={counts.authors}
            icon={<UsersIcon />}
            color="positive"
            onClick={() => goToList('author')}
          />
          <StatCard
            title="Services"
            count={counts.services}
            icon={<CogIcon />}
            color="caution"
            onClick={() => goToList('service')}
          />
          <StatCard
            title="Projects"
            count={counts.projects}
            icon={<FolderIcon />}
            color="positive"
            onClick={() => goToList('project')}
          />
          <StatCard
            title="Comments"
            count={counts.comments}
            icon={<CommentIcon />}
            color="critical"
            onClick={() => goToList('comment')}
          />
          <StatCard
            title="Categories"
            count={counts.categories}
            icon={<TagIcon />}
            color="primary"
            onClick={() => goToList('category')}
          />
        </Grid>

        {/* Recent Activity */}
        <Grid columns={[1, 2]} gap={6}>
          {/* Recent Posts */}
          <Card padding={5} shadow={1} radius={3} tone="transparent" border>
            <Flex align="center" justify="space-between" marginBottom={4}>
              <Text weight="semibold" size={3}>
                Recent Blog Posts
              </Text>
              <Button
                text="New Post"
                icon={<AddCircleIcon />}
                tone="positive"
                onClick={() => quickCreate('post')}
              />
            </Flex>
            <Stack space={3}>
              {recentPosts.length === 0 ? (
                <Text muted>No recent posts</Text>
              ) : (
                recentPosts.map((post) => (
                  <Card key={post._id} padding={4} radius={3} tone="transparent" shadow={1}>
                    <Flex align="center" justify="space-between">
                      <Box>
                        <Text size={1} weight="medium">
                          {post.title}
                        </Text>
                        <Text muted size={1}>
                          by {post.author || 'Unknown'}
                        </Text>
                      </Box>
                      <Flex gap={2}>
                        <Button
                          mode="ghost"
                          padding={2}
                          icon={<ArrowRightIcon />}
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          title="View on site"
                        />
                        <Button
                          mode="ghost"
                          padding={2}
                          icon={<RefreshIcon />}
                          onClick={() => (window.location.href = `/desk/post;${post._id}`)}
                          title="Edit"
                        />
                      </Flex>
                    </Flex>
                  </Card>
                ))
              )}
            </Stack>
          </Card>

          {/* Recent Comments */}
          <Card padding={5} shadow={1} radius={3} tone="transparent" border>
            <Flex align="center" justify="space-between" marginBottom={4}>
              <Text weight="semibold" size={3}>
                Recent Comments
              </Text>
              <Badge tone="critical">{counts.comments} total</Badge>
            </Flex>
            <Stack space={3}>
              {recentComments.length === 0 ? (
                <Text muted>No recent comments</Text>
              ) : (
                recentComments.map((comment) => (
                  <Card key={comment._id} padding={4} radius={3} tone="transparent" shadow={1}>
                    <Text size={1} weight="medium">
                      {comment.name}
                    </Text>
                    <Text muted size={1}>
                      on &quot;{comment.postTitle || 'Deleted Post'}&quot;
                    </Text>
                    <Text size={1} muted style={{marginTop: 8}}>
                      {comment.message.substring(0, 100)}
                      {comment.message.length > 100 ? '...' : ''}
                    </Text>
                  </Card>
                ))
              )}
            </Stack>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Card padding={6} tone="primary" radius={4} shadow={2}>
          <Text weight="bold" size={3} style={{color: 'white'}}>
            Quick Actions
          </Text>
          <Grid columns={[2, 3, 6]} gap={4} marginTop={5}>
            <Button
              text="New Blog Post"
              icon={<AddCircleIcon />}
              tone="positive"
              onClick={() => quickCreate('post')}
            />
            <Button
              text="New Project"
              icon={<AddCircleIcon />}
              tone="positive"
              onClick={() => quickCreate('project')}
            />
            <Button
              text="New Service"
              icon={<AddCircleIcon />}
              tone="positive"
              onClick={() => quickCreate('service')}
            />
            <Button
              text="New Author"
              icon={<AddCircleIcon />}
              tone="positive"
              onClick={() => quickCreate('author')}
            />
            <Button
              text="New Category"
              icon={<AddCircleIcon />}
              tone="positive"
              onClick={() => quickCreate('category')}
            />
            <Button
              text="Refresh Dashboard"
              icon={<RefreshIcon />}
              mode="ghost"
              onClick={() => window.location.reload()}
            />
          </Grid>
        </Card>

        {/* Danger Zone */}
        <Card padding={6} tone="critical" radius={4} shadow={3}>
          <Stack space={5}>
            <Flex align="center" gap={4}>
              <TrashIcon style={{fontSize: 36, color: 'white'}} />
              <Heading size={3} style={{color: 'white'}}>
                Danger Zone
              </Heading>
            </Flex>
            <Text size={2} style={{color: 'white'}}>
              These actions are <strong>permanent and irreversible</strong>. Use with extreme
              caution.
            </Text>

            <Grid columns={[1, 2, 3]} gap={4}>
              <Button
                text={`Delete All Comments (${counts.comments})`}
                icon={<TrashIcon />}
                tone="critical"
                onClick={() => confirmDelete('comment', 'Comments', counts.comments)}
                disabled={!!deleting}
              />
              <Button
                text={`Delete All Posts (${counts.posts})`}
                icon={<TrashIcon />}
                tone="critical"
                onClick={() => confirmDelete('post', 'Blog Posts', counts.posts)}
                disabled={!!deleting}
              />
              <Button
                text={`Delete All Projects (${counts.projects})`}
                icon={<TrashIcon />}
                tone="critical"
                onClick={() => confirmDelete('project', 'Projects', counts.projects)}
                disabled={!!deleting}
              />
              <Button
                text={`Delete All Services (${counts.services})`}
                icon={<TrashIcon />}
                tone="critical"
                onClick={() => confirmDelete('service', 'Services', counts.services)}
                disabled={!!deleting}
              />
              <Button
                text={`Delete All Authors (${counts.authors})`}
                icon={<TrashIcon />}
                tone="critical"
                onClick={() => confirmDelete('author', 'Authors', counts.authors)}
                disabled={!!deleting}
              />
              <Button
                text={`Delete All Categories (${counts.categories})`}
                icon={<TrashIcon />}
                tone="critical"
                onClick={() => confirmDelete('category', 'Categories', counts.categories)}
                disabled={!!deleting}
              />
            </Grid>
          </Stack>
        </Card>

        {/* Unified Confirmation Dialog */}
        {showDialog && (
          <Dialog
            header={`Delete All ${showDialog.split('-')[0].charAt(0).toUpperCase() + showDialog.split('-')[0].slice(1)}s?`}
            id="danger-dialog"
            onClose={() => setShowDialog(null)}
            footer={
              <Flex padding={4} justify="flex-end" gap={3}>
                <Button text="Cancel" onClick={() => setShowDialog(null)} />
                <Button
                  text={deleting ? 'Deleting...' : 'Yes, Delete All'}
                  tone="critical"
                  onClick={() =>
                    deleteAll(
                      showDialog.split('-')[0],
                      showDialog.split('-')[0].charAt(0).toUpperCase() +
                        showDialog.split('-')[0].slice(1) +
                        's',
                    )
                  }
                  disabled={!!deleting}
                />
              </Flex>
            }
          >
            <Box padding={5}>
              <Text>
                This will{' '}
                <strong>
                  permanently delete all {showDialog.split('-')[1]} {showDialog.split('-')[0]}s
                </strong>{' '}
                from your site.
                <br />
                <br />
                <strong>There is no undo.</strong>
              </Text>
            </Box>
          </Dialog>
        )}
      </Stack>
    </Card>
  )
}

// Beautiful Stat Card with hover
const StatCard = ({
  title,
  count,
  icon,
  color,
  onClick,
}: {
  title: string
  count: number
  icon: React.ReactNode
  color: string
  onClick: () => void
}) => (
  <Card
    padding={6}
    radius={4}
    shadow={3}
    tone={color as any}
    style={{cursor: 'pointer', transition: 'all 0.2s'}}
    onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    <Stack space={4}>
      <Flex align="center" gap={4}>
        {React.cloneElement(icon as any, {style: {fontSize: 40}})}
        <Text size={5} weight="bold">
          {count}
        </Text>
      </Flex>
      <Text size={3} weight="semibold">
        {title}
      </Text>
    </Stack>
  </Card>
)

export const dashboardTool = {
  name: 'dashboard',
  title: 'Control Center',
  icon: DashboardIcon,
  component: CustomDashboard,
}