'use client'

import { ConversationTracesWithoutRequests } from "@palico-ai/common";
import { useState } from "react";
import { getRecentConversations } from "../../services/telemetry";
import { toast } from "react-toastify";

interface UseFetchConversationParams {
  pagination: {
    limit: number;
    offset: number;
  };
  initialConversations: ConversationTracesWithoutRequests[];
}

const useFetchConversation = (params: UseFetchConversationParams) => {
  const [conversations, setConversations] = useState(params.initialConversations);
  const [pagination, setPagination] = useState(params.pagination);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newPagination = {
        limit: pagination.limit,
        offset: pagination.offset + pagination.limit,
      };
      const response = await getRecentConversations(newPagination);
      console.log(response);
      setConversations([...conversations, ...response]);
      setPagination(newPagination);
      setHasMore(response.length === pagination.limit);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch more conversations');
    } finally {
      setLoading(false);
    }
  };

  return {
    conversations,
    fetchMore,
    loading,
    hasMore
  };
}

export default useFetchConversation;