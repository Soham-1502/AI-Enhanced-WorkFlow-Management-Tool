// Comprehensive test script to verify all database models
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection and models...');
    
    // Create a test profile
    console.log('\n1. Creating test profile...');
    const testProfile = await prisma.profile.create({
      data: {
        email: 'test-user@example.com',
        password: 'hashed-password-123',
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg'
      }
    });
    console.log('Created profile:', testProfile);
    
    // Create a workspace
    console.log('\n2. Creating test workspace...');
    const testWorkspace = await prisma.workspace.create({
      data: {
        name: 'Test Workspace',
        description: 'A workspace for testing',
        created_by: testProfile.id
      }
    });
    console.log('Created workspace:', testWorkspace);
    
    // Add the user as a workspace member with OWNER role
    console.log('\n3. Adding user as workspace member...');
    const workspaceMember = await prisma.workspaceMember.create({
      data: {
        workspace_id: testWorkspace.id,
        user_id: testProfile.id,
        role: 'OWNER'
      }
    });
    console.log('Created workspace member:', workspaceMember);
    
    // Create a project in the workspace
    console.log('\n4. Creating test project...');
    const testProject = await prisma.project.create({
      data: {
        workspace_id: testWorkspace.id,
        name: 'Test Project',
        description: 'A project for testing',
        status: 'ACTIVE',
        created_by: testProfile.id,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });
    console.log('Created project:', testProject);
    
    // Create a task in the project
    console.log('\n5. Creating test task...');
    const testTask = await prisma.task.create({
      data: {
        project_id: testProject.id,
        title: 'Test Task',
        description: 'A task for testing',
        status: 'TODO',
        priority: 'HIGH',
        assigned_to: testProfile.id,
        created_by: testProfile.id,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });
    console.log('Created task:', testTask);
    
    // Test querying relationships
    console.log('\n6. Testing relationships...');
    
    // Get profile with workspaces
    const profileWithWorkspaces = await prisma.profile.findUnique({
      where: { id: testProfile.id },
      include: {
        workspaces: true,
        workspaceMembers: { include: { workspace: true } },
        createdProjects: true,
        assignedTasks: true,
        createdTasks: true
      }
    });
    console.log('Profile with relationships:', {
      ...profileWithWorkspaces,
      workspaces: profileWithWorkspaces.workspaces.length,
      workspaceMembers: profileWithWorkspaces.workspaceMembers.length,
      createdProjects: profileWithWorkspaces.createdProjects.length,
      assignedTasks: profileWithWorkspaces.assignedTasks.length,
      createdTasks: profileWithWorkspaces.createdTasks.length
    });
    
    // Get workspace with members and projects
    const workspaceWithDetails = await prisma.workspace.findUnique({
      where: { id: testWorkspace.id },
      include: {
        creator: true,
        members: { include: { user: true } },
        projects: true
      }
    });
    console.log('Workspace with relationships:', {
      ...workspaceWithDetails,
      members: workspaceWithDetails.members.length,
      projects: workspaceWithDetails.projects.length
    });
    
    // Get project with tasks
    const projectWithTasks = await prisma.project.findUnique({
      where: { id: testProject.id },
      include: {
        workspace: true,
        creator: true,
        tasks: true
      }
    });
    console.log('Project with relationships:', {
      ...projectWithTasks,
      tasks: projectWithTasks.tasks.length
    });
    
    // Clean up - delete all test data
    console.log('\n7. Cleaning up test data...');
    
    // Delete in reverse order of creation to respect foreign key constraints
    await prisma.task.delete({ where: { id: testTask.id } });
    await prisma.project.delete({ where: { id: testProject.id } });
    await prisma.workspaceMember.delete({ where: { id: workspaceMember.id } });
    await prisma.workspace.delete({ where: { id: testWorkspace.id } });
    await prisma.profile.delete({ where: { id: testProfile.id } });
    
    console.log('All test data deleted successfully');
    console.log('\nDatabase connection and models verified successfully!');
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();