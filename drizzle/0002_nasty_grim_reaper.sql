CREATE INDEX "drink_response_date_idx" ON "drink_response" USING btree ("date");--> statement-breakpoint
CREATE INDEX "drink_response_user_date_idx" ON "drink_response" USING btree ("user_id","date");