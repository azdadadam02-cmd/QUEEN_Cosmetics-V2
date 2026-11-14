export default function FormError({ message, success }) {
  if (message) return <p className="error-text form-error" role="alert">{message}</p>;
  if (success) return <p className="form-success" role="status">{success}</p>;
  return null;
}
