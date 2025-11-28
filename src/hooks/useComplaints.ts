import { useMemo, useState, useEffect } from 'react';
import complaintsData from '../data/bk_complaints_1000.json';
import type { Complaint, ComplaintWithMetadata } from '../types/complaints';
import { parseLocation } from '../utils/parseLocation';
import { generateCustomer } from '../utils/generateCustomerData';
import { getAngerLevel } from '../utils/angerLevel';

export function useComplaints() {
  const [isLoading, setIsLoading] = useState(true);

  const enrichedComplaints = useMemo<ComplaintWithMetadata[]>(() => {
    // Handle both array format and object format with complaints key
    const complaints = Array.isArray(complaintsData)
      ? complaintsData
      : (complaintsData as any).complaints || [];

    return (complaints as Complaint[]).map((complaint) => {
      // Parse location - use city/state from extracted_data if available
      const location = complaint.extracted_data.city && complaint.extracted_data.state
        ? {
            city: complaint.extracted_data.city,
            state: complaint.extracted_data.state,
            stateAbbr: complaint.extracted_data.state,
            raw: complaint.extracted_data.location || `${complaint.extracted_data.city}, ${complaint.extracted_data.state}`,
          }
        : parseLocation(complaint.extracted_data.location);

      // Generate customer data
      const customer = generateCustomer(complaint.id, location.state, location.stateAbbr, location.city);

      // Get anger level
      const anger = getAngerLevel(complaint.tone);

      // Generate timestamp (simulate recent complaints)
      const now = new Date();
      const minutesAgo = Math.floor(Math.random() * 1440); // Random time in last 24 hours
      const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000);

      return {
        ...complaint,
        customer,
        location,
        anger,
        timestamp,
      };
    });
  }, []);

  // Extract keywords_index from the data
  const keywordsIndex = useMemo<string[]>(() => {
    return (complaintsData as any).keywords_index || [];
  }, []);

  // Simulate loading delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second delay to show the cool loader

    return () => clearTimeout(timer);
  }, []);

  return {
    complaints: enrichedComplaints,
    keywordsIndex,
    isLoading,
  };
}
