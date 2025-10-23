import TaskController from '../controllers/TaskController.js';

const tests = [];
let passed = 0;
let failed = 0;

function test(description, testFn) {
  tests.push({ description, testFn });
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toContain(value) {
      if (!actual.includes(value)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(value)}`);
      }
    },
    toHaveLength(length) {
      if (actual.length !== length) {
        throw new Error(`Expected length ${actual.length} to be ${length}`);
      }
    }
  };
}

// Mock request and response objects
function mockReq(params = {}, query = {}, body = {}) {
  return { params, query, body };
}

function mockRes() {
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.data = data;
      return res;
    }
  };
  return res;
}

// Test create task
test('should create a task with valid data', () => {
  const controller = new TaskController();
  const req = mockReq({}, {}, {
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    priority: 'high'
  });
  const res = mockRes();

  controller.createTask(req, res);

  expect(res.statusCode).toBe(201);
  expect(res.data).toBeDefined();
  expect(res.data.title).toBe('Test Task');
  expect(res.data.description).toBe('Test Description');
  expect(res.data.status).toBe('pending');
  expect(res.data.priority).toBe('high');
  expect(res.data.id).toBeDefined();
  expect(res.data.createdAt).toBeDefined();
  expect(res.data.updatedAt).toBeDefined();
});

// Test update and delete
test('should update and delete a task', () => {
  const controller = new TaskController();
  
  // Create
  const createReq = mockReq({}, {}, { title: 'Original Task', priority: 'low' });
  const createRes = mockRes();
  controller.createTask(createReq, createRes);
  
  const taskId = createRes.data.id;

  // Update
  const updateReq = mockReq({ taskId }, {}, { 
    title: 'Updated Task', 
    status: 'completed',
    priority: 'high'
  });
  const updateRes = mockRes();
  controller.updateTask(updateReq, updateRes);

  expect(updateRes.statusCode).toBe(200);
  expect(updateRes.data.title).toBe('Updated Task');
  expect(updateRes.data.status).toBe('completed');
  expect(updateRes.data.priority).toBe('high');

  // Get task
  const getReq = mockReq({ taskId });
  const getRes = mockRes();
  controller.getTask(getReq, getRes);

  expect(getRes.statusCode).toBe(200);
  expect(getRes.data.title).toBe('Updated Task');

  // Delete
  const deleteReq = mockReq({ taskId });
  const deleteRes = mockRes();
  controller.deleteTask(deleteReq, deleteRes);

  expect(deleteRes.statusCode).toBe(200);
  expect(deleteRes.data.message).toBe('Task deleted successfully');

  // This should fail, it tries to get a deleted task
  const getDeletedReq = mockReq({ taskId });
  const getDeletedRes = mockRes();
  controller.getTask(getDeletedReq, getDeletedRes);

  expect(getDeletedRes.statusCode).toBe(404);
  expect(getDeletedRes.data.error).toBe('Task not found');
});

// Run tests
tests.forEach(({ description, testFn }) => {
  try {
    testFn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  ${error.message}\n`);
    failed++;
  }
});

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
