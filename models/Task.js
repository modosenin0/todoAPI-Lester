//Define strcture of Task
export default class Task {
  constructor(id, title, description = '', status = 'pending', priority = 'medium') {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status; 
    this.priority = priority; 
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
