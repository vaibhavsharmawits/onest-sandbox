### [Draft]Test Scenarios WO - 2.0

Logs to be submitted for applicable flows below by creating PR.

---

#### Provider Setup

- Provider NP Setup  
  Define the catalog with 2 separate providers (2 locations per provider) and the following, as applicable:

  - Supported fulfillment options: [TBD]
  - Credentials

- Category-Specific Catalog Setup  
  Define a category-specific catalog with the same configuration as the general provider setup, but including the following:
  - Category-specific variations:
    - Jobs customizations: Base applications, variants, application availability, custom menu. Consider the following scenarios:
      1. Lead application (price X)
      2. Verified lead (price > 0)
      3. Recruitment fees & Verified lead > 0
    - Variants (along with base applications)

---

### Flow Details

- **Flow 1: Catalog Pull & Refresh**

  1. Seeker NP initiates full catalog pull
  2. Provider responds with full catalog
  3. Seeker NP initiates catalog incremental refresh request
  4. Provider NP responds with incremental catalog refresh response

- **Flow 2: Application Selection & Fulfillment**

  1. Seeker selects multiple applications (> 1 qty for each application) for applying
  2. Seeker selects one application for applying
  3. Provider NP provides all fulfillment slots (different fulfillment types)
  4. Seeker selects different fulfillment type
  5. Provider NP accepts and proceeds to submit
  6. Application is confirmed
  7. Seeker NP tracks live status of application
  8. Unsolicited status updates for application until fulfilled

- **Flow 3: Application Checkout & Status Tracking**

  1. Seeker selects multiple applications (> 1 qty for each application) for checkout
  2. Provider NP provides all fulfillment slots (different fulfillment types), some with tracking enabled
  3. Provider NP provides details of application that is out of stock or for which the quantity requested isn't available
  4. Seeker selects different fulfillment type
  5. Seeker NP accepts and proceeds to checkout
  6. Application is confirmed
  7. Seeker NP tracks live status of application
  8. Unsolicited status updates for application until fulfilled

- **Flow 4: Application Cancellation (Seeker)**

  1. Seeker NP cancels application before processing

- **Flow 5: Application Cancellation (Provider)**

  1. Provider NP cancels application due to seeker unavailability

- **Flow 6: Application Cancellation & Return (Provider)**
  1. Provider cancels one of the applications before processing
  2. Seeker returns an application, which provider NP accepts with liquidation
  3. Seeker cancels another application, which provider NP accepts with return of application

---

### Catalog Rejection Flows (Optional)

- **Flow 7: Catalog Rejection - Full Catalog**

  1. Seeker app sends a search by city (full catalog) request
  2. Provider app responds with catalog having errors at application/provider/BPP level
  3. Seeker app responds with an ACK with minimum catalog processing time
  4. Seeker app sends catalog rejection report

- **Flow 8: Catalog Rejection - Rectification**

  1. Provider app rectifies the issues as per the catalog rejection report and responds with a corrected catalog in the next pull
  2. Seeker app responds with a successfully processed status

- **Flow 9: Catalog Rejection - Incremental Search**
  1. Seeker app sends an incremental search request
  2. Provider app responds with incremental catalog having errors at application/provider/BPP level
  3. Seeker app responds with an ACK with minimum catalog processing time
  4. Seeker app sends catalog rejection report

---

For detailed flow steps and further assistance, please refer to the [official documentation](https://docs.google.com/spreadsheets/d/118ShHWOE5Lx3Wh_35VLadqltMjp_AkCIZW0prP9xbNY/edit?gid=0#gid=0).

