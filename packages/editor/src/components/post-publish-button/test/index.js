/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { PostPublishButton } from '../';

jest.useFakeTimers();

describe( 'PostPublishButton', () => {
	describe( 'aria-disabled', () => {
		it( 'should be true if post is currently saving', () => {
			render( <PostPublishButton isPublishable isSaveable isSaving /> );

			expect(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			).toHaveAttribute( 'aria-disabled', 'true' );
		} );

		it( 'should be true if forceIsSaving is true', () => {
			render(
				<PostPublishButton isPublishable isSaveable forceIsSaving />
			);

			expect(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			).toHaveAttribute( 'aria-disabled', 'true' );
		} );

		it( 'should be true if post is not publishable and not forceIsDirty', () => {
			render(
				<PostPublishButton
					isSaveable
					isPublishable={ false }
					forceIsDirty={ false }
				/>
			);

			expect(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			).toHaveAttribute( 'aria-disabled', 'true' );
		} );

		it( 'should be true if post is not saveable', () => {
			render( <PostPublishButton isPublishable isSaveable={ false } /> );

			expect(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			).toHaveAttribute( 'aria-disabled', 'true' );
		} );

		it( 'should be true if post saving is locked', () => {
			render(
				<PostPublishButton
					isPublishable
					isSaveable
					isPostSavingLocked
				/>
			);

			expect(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			).toHaveAttribute( 'aria-disabled', 'true' );
		} );

		it( 'should be false if post is saveable but not publishable and forceIsDirty is true', () => {
			render(
				<PostPublishButton
					isSaveable
					isPublishable={ false }
					forceIsDirty
				/>
			);

			expect(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			).toHaveAttribute( 'aria-disabled', 'false' );
		} );

		it( 'should be false if post is publishave and saveable', () => {
			render( <PostPublishButton isPublishable isSaveable /> );

			expect(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			).toHaveAttribute( 'aria-disabled', 'false' );
		} );
	} );

	describe( 'publish status', () => {
		it( 'should be pending for contributor', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			render(
				<PostPublishButton
					hasPublishAction={ false }
					onStatusChange={ onStatusChange }
					onSave={ onSave }
					isSaveable
					isPublishable
				/>
			);

			await user.click(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			);

			expect( onStatusChange ).toHaveBeenCalledWith( 'pending' );
		} );

		it( 'should be future for scheduled post', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			render(
				<PostPublishButton
					hasPublishAction
					onStatusChange={ onStatusChange }
					onSave={ onSave }
					isBeingScheduled
					isSaveable
					isPublishable
				/>
			);

			await user.click(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			);

			expect( onStatusChange ).toHaveBeenCalledWith( 'future' );
		} );

		it( 'should be private for private visibility', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			render(
				<PostPublishButton
					hasPublishAction
					onStatusChange={ onStatusChange }
					onSave={ onSave }
					visibility="private"
					isSaveable
					isPublishable
				/>
			);

			await user.click(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			);

			expect( onStatusChange ).toHaveBeenCalledWith( 'private' );
		} );

		it( 'should be publish otherwise', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			render(
				<PostPublishButton
					hasPublishAction
					onStatusChange={ onStatusChange }
					onSave={ onSave }
					isSaveable
					isPublishable
				/>
			);

			await user.click(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			);

			expect( onStatusChange ).toHaveBeenCalledWith( 'publish' );
		} );
	} );

	describe( 'click', () => {
		it( 'should save with status', async () => {
			const user = userEvent.setup( {
				advanceTimers: jest.advanceTimersByTime,
			} );
			const onStatusChange = jest.fn();
			const onSave = jest.fn();
			render(
				<PostPublishButton
					hasPublishAction
					onStatusChange={ onStatusChange }
					onSave={ onSave }
					isSaveable
					isPublishable
				/>
			);

			await user.click(
				screen.getByRole( 'button', { name: 'Submit for Review' } )
			);

			expect( onStatusChange ).toHaveBeenCalledWith( 'publish' );
			expect( onSave ).toHaveBeenCalled();
		} );
	} );

	it( 'should have save modifier class', () => {
		render( <PostPublishButton isSaving isPublished /> );

		expect(
			screen.getByRole( 'button', { name: 'Submit for Review' } )
		).toHaveClass( 'is-busy' );
	} );
} );
