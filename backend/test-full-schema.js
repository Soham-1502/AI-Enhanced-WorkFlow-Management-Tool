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
        id: '00000000-0000-0000-0000-000000000001', // Using a fixed UUID for simplicity
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
    
    // Add the user as a workspace member with MEMBER role
    console.log('\n3. Adding user as workspace member...');
    const workspaceMember = await prisma.workspaceMember.create({
      data: {
        workspace_id: testWorkspace.id,
        user_id: testProfile.id,
        role: 'MEMBER'
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
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        position: 1
      }
    });
    console.log('Created task:', testTask);
    
    // Create a subtask
    console.log('\n6. Creating test subtask...');
    const testSubtask = await prisma.task.create({
      data: {
        project_id: testProject.id,
        title: 'Test Subtask',
        description: 'A subtask for testing',
        status: 'TODO',
        priority: 'MEDIUM',
        assigned_to: testProfile.id,
        created_by: testProfile.id,
        parent_task_id: testTask.id,
        position: 1
      }
    });
    console.log('Created subtask:', testSubtask);
    
    // Create a task comment
    console.log('\n7. Creating test task comment...');
    const testTaskComment = await prisma.taskComment.create({
      data: {
        task_id: testTask.id,
        user_id: testProfile.id,
        content: 'This is a test comment'
      }
    });
    console.log('Created task comment:', testTaskComment);
    
    // Create a task attachment
    console.log('\n8. Creating test task attachment...');
    const testTaskAttachment = await prisma.taskAttachment.create({
      data: {
        task_id: testTask.id,
        file_name: 'test-file.pdf',
        file_url: 'https://example.com/files/test-file.pdf',
        file_size: 1024n, // 1KB
        mime_type: 'application/pdf',
        uploaded_by: testProfile.id
      }
    });
    console.log('Created task attachment:', testTaskAttachment);
    
    // Create an event
    console.log('\n9. Creating test event...');
    const testEvent = await prisma.event.create({
      data: {
        workspace_id: testWorkspace.id,
        project_id: testProject.id,
        title: 'Test Event',
        description: 'A test event',
        start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours after start
        location: 'Virtual',
        event_type: 'MEETING',
        created_by: testProfile.id
      }
    });
    console.log('Created event:', testEvent);
    
    // Create an event attendee
    console.log('\n10. Creating test event attendee...');
    const testEventAttendee = await prisma.eventAttendee.create({
      data: {
        event_id: testEvent.id,
        user_id: testProfile.id,
        status: 'ACCEPTED'
      }
    });
    console.log('Created event attendee:', testEventAttendee);
    
    // Create a notification
    console.log('\n11. Creating test notification...');
    const testNotification = await prisma.notification.create({
      data: {
        user_id: testProfile.id,
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'INFO',
        related_id: testTask.id
      }
    });
    console.log('Created notification:', testNotification);
    
    // Test querying relationships
    console.log('\n12. Testing relationships...');
    
    // Get profile with workspaces
    const profileWithWorkspaces = await prisma.profile.findUnique({
      where: { id: testProfile.id },
      include: {
        workspaces: true,
        workspaceMembers: { include: { workspace: true } },
        createdProjects: true,
        assignedTasks: true,
        createdTasks: true,
        createdEvents: true,
        eventAttendees: true,
        taskComments: true,
        notifications: true
      }
    });
    console.log('Profile with relationships:', {
      id: profileWithWorkspaces.id,
      email: profileWithWorkspaces.email,
      workspaces: profileWithWorkspaces.workspaces.length,
      workspaceMembers: profileWithWorkspaces.workspaceMembers.length,
      createdProjects: profileWithWorkspaces.createdProjects.length,
      assignedTasks: profileWithWorkspaces.assignedTasks.length,
      createdTasks: profileWithWorkspaces.createdTasks.length,
      createdEvents: profileWithWorkspaces.createdEvents.length,
      eventAttendees: profileWithWorkspaces.eventAttendees.length,
      taskComments: profileWithWorkspaces.taskComments.length,
      notifications: profileWithWorkspaces.notifications.length
    });
    
    // Get task with subtasks
    const taskWithSubtasks = await prisma.task.findUnique({
      where: { id: testTask.id },
      include: {
        subtasks: true,
        comments: true,
        attachments: true
      }
    });
    console.log('Task with relationships:', {
      id: taskWithSubtasks.id,
      title: taskWithSubtasks.title,
      subtasks: taskWithSubtasks.subtasks.length,
      comments: taskWithSubtasks.comments.length,
      attachments: taskWithSubtasks.attachments.length
    });
    
    // Clean up - delete all test data
    console.log('\n13. Cleaning up test data...');
    
    // Delete in reverse order of creation to respect foreign key constraints
    await prisma.notification.delete({ where: { id: testNotification.id } });
    await prisma.eventAttendee.delete({ where: { id: testEventAttendee.id } });
    await prisma.event.delete({ where: { id: testEvent.id } });
    await prisma.taskAttachment.delete({ where: { id: testTaskAttachment.id } });
    await prisma.taskComment.delete({ where: { id: testTaskComment.id } });
    await prisma.task.delete({ where: { id: testSubtask.id } });
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