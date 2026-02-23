
import { DocumentComment } from '@/types/document';

// Stub implementation — document_comments table does not exist yet.
const inMemoryComments: DocumentComment[] = [];

export async function getDocumentComments(documentId: string): Promise<DocumentComment[]> {
  return inMemoryComments.filter(c => c.document_id === documentId);
}

export async function createDocumentComment(
  documentId: string,
  userId: string,
  userName: string,
  content: string
): Promise<DocumentComment> {
  const comment: DocumentComment = {
    id: crypto.randomUUID(),
    document_id: documentId,
    user_id: userId,
    user_name: userName,
    content,
    created_at: new Date().toISOString(),
  };
  inMemoryComments.push(comment);
  return comment;
}

export async function updateDocumentComment(
  commentId: string,
  content: string
): Promise<DocumentComment> {
  const idx = inMemoryComments.findIndex(c => c.id === commentId);
  if (idx === -1) throw new Error('Comment not found');
  inMemoryComments[idx] = { ...inMemoryComments[idx], content, updated_at: new Date().toISOString() };
  return inMemoryComments[idx];
}

export async function deleteDocumentComment(commentId: string): Promise<void> {
  const idx = inMemoryComments.findIndex(c => c.id === commentId);
  if (idx !== -1) inMemoryComments.splice(idx, 1);
}

export async function getCommentCount(documentId: string): Promise<number> {
  return inMemoryComments.filter(c => c.document_id === documentId).length;
}
