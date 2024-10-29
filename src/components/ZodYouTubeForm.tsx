import { useForm, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Email format is not valid"),
  channel: z.string().min(1, "Channel is required"),
});

type FormValues = {
  username: string;
  email: string;
  channel: string;
};

export default function ZodYouTubeForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      channel: "",
    },
  });

  const { register, control, handleSubmit, formState, reset } = form;
  const { isDirty, isSubmitting, isSubmitSuccessful, errors } = formState;
  // console.log(touchedFields, dirtyFields, isDirty);

  const onSubmit = (data: FormValues) => {
    console.log(data, "FORM VALUE");
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log(errors, "ERROR");
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div>
      <h1>Zod Youtube Form</h1>
      {/* <h2>Watched value : {JSON.stringify(watchForm)}</h2> */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: { value: true, message: "Username is required" } })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-0-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email format",
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return fieldValue !== "admin@example.com" || "Enter a different email address";
                },
                notBlackListed: (fieldValue) => {
                  return !fieldValue.endsWith("baddomain.com") || "This domain is not supported";
                },
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                  const data = await response.json();
                  return data.length == 0 || "Email already exists";
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", { required: { value: true, message: "Channel is required" } })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <button>Submit</button>

        <DevTool control={control} />
      </form>
    </div>
  );
}
