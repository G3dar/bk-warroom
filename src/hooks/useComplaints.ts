import { useMemo } from 'react';
import complaintsData from '../data/bk_complaint_flows.json';
import type { Complaint, ComplaintWithMetadata } from '../types/complaints';
import { parseLocation } from '../utils/parseLocation';
import { generateCustomer } from '../utils/generateCustomerData';
import { getAngerLevel } from '../utils/angerLevel';

export function useComplaints() {
  const enrichedComplaints = useMemo<ComplaintWithMetadata[]>(() => {
    // Handle both array format and object format with complaints key
    const complaints = Array.isArray(complaintsData)
      ? complaintsData
      : (complaintsData as any).complaints || [];

    return (complaints as Complaint[]).map((complaint) => {
      // Parse location
      const location = parseLocation(complaint.extracted_data.location);

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

  return {
    complaints: enrichedComplaints,
  };
}
